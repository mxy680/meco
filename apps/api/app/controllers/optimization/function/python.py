from app.models import OptimizationRequest
from runner.function.client import Runner
from runner.utils.score import compute_score
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_test_code, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
from optimizer.utils.print import print_function, print_metrics
from .utils import execute_and_verify

language = "python"


async def optimize_python(request: OptimizationRequest):
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
            function, command, optimizer, runner, request.test_cases
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
                function, command, optimizer, runner, request.test_cases
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
                function, command, optimizer, runner, request.test_cases
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
        scored_solutions = compute_score(scores)

        # Find the best solution (lowest composite_score).
        best_solution = min(scored_solutions, key=lambda s: s["composite_score"])

        print("\n\n🏆 Best Approach Found:")
        print(f"Approach Description: {best_solution['approach']}")
        print("Solution Function Code:")
        print(best_solution["solution"])
