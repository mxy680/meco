from app.models import OptimizationRequest
from runner.function.client import Runner
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_test_code, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
from typing import Tuple

language = "python"


def normalize_metric(value: float, min_value: float, max_value: float) -> float:
    # Avoid division by zero if min and max are the same.
    if max_value == min_value:
        return 0.0
    return (value - min_value) / (max_value - min_value)


def compute_composite_scores(
    scores: list,
    runtime_weight: float = 0.7,
    cpu_weight: float = 0.1,
    memory_weight: float = 0.2,
) -> list:
    """
    Given a list of solutions with raw metrics, compute a composite score for each.
    Each solution in 'scores' is a dictionary with keys: 'runtime', 'cpu_percent', 'memory_usage',
    and other fields.
    Returns the same list with an extra key 'composite_score' for each solution.
    """
    # Find min and max for each metric.
    min_runtime = min(s["runtime"] for s in scores)
    max_runtime = max(s["runtime"] for s in scores)

    min_cpu = min(s["cpu_percent"] for s in scores)
    max_cpu = max(s["cpu_percent"] for s in scores)

    min_memory = min(s["memory_usage"] for s in scores)
    max_memory = max(s["memory_usage"] for s in scores)

    for s in scores:
        norm_runtime = normalize_metric(s["runtime"], min_runtime, max_runtime)
        norm_cpu = normalize_metric(s["cpu_percent"], min_cpu, max_cpu)
        norm_memory = normalize_metric(s["memory_usage"], min_memory, max_memory)

        # The composite score is a weighted sum of the normalized metrics.
        # Lower composite scores are better.
        s["composite_score"] = (
            runtime_weight * norm_runtime
            + cpu_weight * norm_cpu
            + memory_weight * norm_memory
        )

    return scores


async def optimize_python(request: OptimizationRequest):
    def print_function(title: str, function_code: str):
        print(f"\n🔢 {title}")
        print(function_code)

    def print_metrics(result: dict):
        runtime = result.get("runtime", float("inf"))
        cpu_percent = result.get("cpu_percent", float("inf"))
        memory_usage = result.get("memory_usage", float("inf"))
        print(f"⏱ Runtime: {runtime} sec")
        print(f"📈 CPU Usage: {cpu_percent}%")
        print(f"💾 Memory Usage: {memory_usage} MB")

    def execute_and_verify(
        function: str, command: str, optimizer, test_cases
    ) -> Tuple[bool, str, dict]:
        """
        Execute terminal command (if provided) and run the function.
        Returns a tuple: (valid, message, result)
        """
        if command:
            term_result = runner.terminal(command)
            exit_code = term_result.get("exit_code", 0)
            if exit_code != 0:
                return (
                    False,
                    f"Terminal command failed with exit code {exit_code}:\n{term_result.get('stdout', '')}",
                    None,
                )
        result = runner.run(function)
        output = result.get("stdout", "")
        exit_code = result.get("exit_code", 0)
        if exit_code != 0:
            return (
                False,
                f"Function execution failed with exit code {exit_code}:\n{output}",
                result,
            )
        valid, message = optimizer.verify(test_cases, output)
        return valid, message, result

    valid_sig, sig_message = validate_signature(
        request.signature, request.test_cases, language
    )
    if not valid_sig:
        raise ValueError(f"❌ Signature validation failed: {sig_message}")
    fn = extract_signature(request.signature, language)

    test_code = extract_test_code(fn, request.test_cases, language)

    runner = Runner(language, test_code)
    runner.start_container()

    for model in request.models:
        print(f"\n🔍 Processing model: {model}")

        optimizer = OpenAIOptimizer(
            request.signature, request.description, language, model, test_code
        )
        response = optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]
        print_function("Baseline Function Code:", function)

        valid_fn, validation_message = validate_fn(function, language)
        if not valid_fn:
            raise ValueError(
                f"❌ Baseline function validation failed: {validation_message}"
            )
        print("✅ Baseline function validation passed.")

        valid_exec, exec_message, result = execute_and_verify(
            function, command, optimizer, request.test_cases
        )
        while not valid_exec:
            print(f"❌ Model {model} failed baseline verification: {exec_message}")
            print("🔄 Requesting optimizer fix...")

            response = optimizer.fix(function, exec_message)
            function = response["function_implementation"]
            command = response["terminal_command"]
            print_function("Fixed Function Code:", function)

            # Validate the fixed function.
            valid_fn, validation_message = validate_fn(function, language)
            if not valid_fn:
                raise ValueError(
                    f"❌ Fixed function validation failed: {validation_message}"
                )
            print("✅ Fixed function validation passed.")

            valid_exec, exec_message, result = execute_and_verify(
                function, command, optimizer, request.test_cases
            )

        print(f"✅ Model {model} baseline function passed all test cases.")
        print_metrics(result)

        approach_response = optimizer.approach(function)
        scores = []
        for approach_obj in approach_response["approaches"]:
            approach = approach_obj["description"]
            print(f"\n🛠 Generating solution for approach: {approach}")
            sol_response = optimizer.solution(function, approach)
            function = sol_response["function_implementation"]
            command = sol_response["terminal_command"]
            print_function("Generated Solution Function Code:", function)

            if command:
                print(f"💻 Executing terminal command: {command}")
                term_resp = runner.terminal(command)
                if term_resp.get("exit_code", 0) != 0:
                    print(f"❌ Terminal command failed: {term_resp.get('stdout', '')}")
                    continue
                print("✅ Terminal command executed successfully.")

            valid_fn, validation_message = validate_fn(function, language)
            if not valid_fn:
                print(
                    f"❌ Generated solution function validation failed: {validation_message}"
                )
                continue
            print("✅ Generated solution function validated.")

            valid_exec, exec_message, result = execute_and_verify(
                function, command, optimizer, request.test_cases
            )
            if valid_exec:
                print("✅ Generated solution passed all test cases.")
                print_metrics(result)
                scores.append(
                    {
                        "approach": approach,
                        "solution": function,
                        "runtime": result.get("runtime", float("inf")),
                        "cpu_percent": result.get("cpu_percent", float("inf")),
                        "memory_usage": result.get("memory_usage", float("inf")),
                    }
                )
            else:
                print(f"❌ Generated solution failed verification: {exec_message}")

        # Normalize and compute composite scores.
        scored_solutions = compute_composite_scores(scores)

        # Find the best solution (lowest composite_score).
        best_solution = min(scored_solutions, key=lambda s: s["composite_score"])

        print("\n\n🏆 Best Approach Found:")
        print(f"Approach Description: {best_solution['approach']}")
        print("Solution Function Code:")
        print(best_solution["solution"])
