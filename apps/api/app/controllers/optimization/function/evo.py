from optimizer.function.client import FunctionOptimizer
from runner.function.client import Runner
from typing import Tuple
from .utils import print_function, print_metrics


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
        validate: callable,  # For validating a function
    ):
        self.signature = signature
        self.description = description
        self.language = language
        self.model = model
        self.test_cases = test_cases
        self.test_code = test_code
        self.optimizer = optimizer
        self.runner = runner
        self.validate = validate

    async def execute_and_verify(
        self,
        function: str,
        command: str,
        max_retries: int = 3,
    ) -> Tuple[bool, str, dict]:
        """
        Execute terminal command (if provided) and run the function.
        Returns a tuple: (valid, message, result)
        """
        if command:
            term_result = self.runner.terminal(command)
            exit_code = term_result.get("exit_code", 0)
            if exit_code != 0:
                return (
                    False,
                    f"Terminal command failed with exit code {exit_code}:\n{term_result.get('stdout', '')}",
                    None,
                )
        result = self.runner.run(function)
        output = result.get("stdout", "")
        exit_code = result.get("exit_code", 0)
        if exit_code != 0:
            return (
                False,
                f"Function execution failed with exit code {exit_code}:\n{output}",
                result,
            )
        valid, message = self.optimizer.verify(self.test_cases, output)

        i: int = 0
        while not valid and i < max_retries:
            i += 1
            print(f"❌ Failed baseline verification after {i-1} retries: {message}")
            print("🔄 Requesting optimizer fix...")

            response = self.optimizer.fix(function, message)
            function = response["function_implementation"]
            command = response["terminal_command"]
            print_function("Fixed Function Code:", function)

            # Validate the fixed function.
            valid_fn, validation_message = self.validate(function, self.language)
            if not valid_fn:
                raise ValueError(
                    f"❌ Fixed function validation failed: {validation_message}"
                )
            print("✅ Fixed function validation passed.")

            valid, message, result = self.execute_and_verify(
                function, command, self.optimizer, self.runner, self.test_cases
            )

        return valid, message, result

    async def baseline(self):
        response = self.optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]
        print_function("Baseline Function Code:", function)

        valid_fn, validation_message = self.validate(function, self.language)
        if not valid_fn:
            raise ValueError(
                f"❌ Baseline function validation failed: {validation_message}"
            )
        print("✅ Baseline function validation passed.")

        valid, message, result = await self.execute_and_verify(
            function,
            command,
        )

        if not valid:
            print(f"❌ Baseline function failed verification: {message}")

        print("✅ Baseline function passed all test cases.")
        print_metrics(result)
