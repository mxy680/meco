from optimizer.function.client import FunctionOptimizer
from runner.function.client import Runner
from typing import Tuple
from app.src.evolution.node import FunctionNode


class EvolutionManager:
    def __init__(
        self,
        signature: str,  # Assumes validity
        description: str,
        language: str,
        model: str,  # Each model has independent evolution manager
        test_cases: list[dict],  # For output verification
        test_code: str,  # For script injection
        optimizer: FunctionOptimizer,  # For generating optimized code
        runner: Runner,  # For executing code
        validate_fn: callable,  # For validating a function
        validate_command: callable,  # For validating a command
        num_approaches: int = 3,
        max_retries: int = 3,
    ):
        self.signature = signature
        self.description = description
        self.language = language
        self.model = model
        self.test_cases = test_cases
        self.test_code = test_code
        self.optimizer = optimizer
        self.runner = runner
        self.validate_fn = validate_fn
        self.validate_command = validate_command
        self.num_approaches = num_approaches
        self.max_retries = max_retries
        self.root: FunctionNode = None
        self.generation: int = 0

    async def execute_and_verify(
        self,
        function: str,
        command: str,
    ) -> Tuple[bool, str, dict]:
        """
        Execute terminal command (if provided) and run the function.
        Returns a tuple: (valid, message, result)
        """
        if command:
            valid, message = self.validate_command(command, self.language)
            if valid:
                term_result = self.runner.terminal(command)
                exit_code = term_result.get("exit_code", 0)
                if exit_code != 0:
                    return (
                        False,
                        f"Terminal command failed with exit code {exit_code}:\n{term_result.get('stdout', '')}",
                        None,
                    )

        valid, message = self.validate_fn(function, self.language)
        if valid:
            result = self.runner.run(function)
            output = result.get("stdout", "")
            exit_code = result.get("exit_code", 0)
            if exit_code != 0:
                message = (
                    f"Function execution failed with exit code {exit_code}:\n{output}",
                )
                valid = False
            else:
                valid, message = self.optimizer.verify(self.test_cases, output)

        i: int = 0
        while not valid and i < self.max_retries:
            i += 1
            print(f"❌ Failed function verification after {i-1} retries: {message}")
            print("🔄 Requesting optimizer fix...")

            response = self.optimizer.fix(function, message)
            function = response["function_implementation"]
            command = response["terminal_command"]
            self.print_function("Fixed Function Code:", function)
            self.print_terminal_command(command)

            valid, message, result = await self.execute_and_verify(function, command)

        return valid, message, result

    async def baseline(self):
        response = self.optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]
        self.print_function("Baseline Function Code:", function)
        self.print_terminal_command(command)

        valid, message, result = await self.execute_and_verify(
            function,
            command,
        )

        if not valid:
            print(f"❌ Baseline function failed verification: {message}")
            return

        metrics = self.get_metrics(result)
        self.print_metrics(metrics)

        self.root = FunctionNode(self.description, function, metrics)
        self.generation = 1

    async def evolve(self):
        print(f"\nGeneration {self.generation}")
        function = self.root.solution
        generate_approaches_response = self.optimizer.approach(function)
        for approach in generate_approaches_response["approaches"]:
            approach_description = approach["description"]
            print(f"\nGenerating solution for approach: {approach_description}")
            solution = self.optimizer.solution(function, approach_description)
            function = solution["function_implementation"]
            command = solution["terminal_command"]
            self.print_function("Generated Solution Function Code:", function)
            self.print_terminal_command(command)
            valid, message, result = await self.execute_and_verify(function, command)

            if not valid:
                print(f"❌ Baseline function failed verification: {message}")
                continue

            metrics = self.get_metrics(result)
            self.print_metrics(metrics)

            print("=" * 100)

            child = FunctionNode(approach_description, function, metrics, self.root)
            self.root.add_child(child)

        winner = self.winner(self.root.children)
        self.root = winner
        self.generation += 1

    @staticmethod
    def get_metrics(result: dict):
        return {
            "runtime": result.get("runtime", float("inf")),
            "cpu_percent": result.get("cpu_percent", float("inf")),
            "memory_usage": result.get("memory_usage", float("inf")),
        }

    @staticmethod
    def print_metrics(metrics: dict):
        print(f"⏱ Runtime: {metrics['runtime']} sec")
        print(f"📈 CPU Usage: {metrics['cpu_percent']}%")
        print(f"💾 Memory Usage: {metrics['memory_usage']} MB")

    @staticmethod
    def print_function(title: str, function_code: str):
        print(f"\n🔢 {title}")
        print(function_code)

    @staticmethod
    def print_terminal_command(command: str):
        if command:
            print(f"\n🔢 Terminal Command: {command}")

    @staticmethod
    def winner(nodes: list[FunctionNode]) -> dict:
        return min(nodes, key=lambda x: x.metrics["runtime"])
