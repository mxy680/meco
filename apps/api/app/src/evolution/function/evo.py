from optimizer.function.client import FunctionOptimizer
from runner.function.client import Runner
from typing import Tuple
from app.src.evolution.node import FunctionNode
from app.src.evolution.logger import Logger


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
        self.curr: FunctionNode = None
        self.generation: int = 0
        self.logger = Logger("evolution.log")

    async def _execute_and_verify(
        self,
        function: str,
        command: str,
    ) -> Tuple[bool, str, dict]:
        """
        Execute terminal command (if provided) and run the function.
        Returns a tuple: (valid, message, result)
        """
        self.logger.log("Executing and verifying the function.", "info")
        valid, message, result = await self._run_command_and_function(function, command)
        retry = 0
        while not valid and retry < self.max_retries:
            self.logger.log(message, "warning")
            self.logger.log(f"Fixing the function. Retry {retry + 1}.", "info")
            retry += 1
            response = self.optimizer.fix(function, message)
            function = response["function_implementation"]
            command = response["terminal_command"]

            self.logger.log(f"\n{function}", "debug")
            self.logger.log(f"\n{command}", "debug")

            valid, message, result = await self._run_command_and_function(
                function, command
            )

        return valid, message, result

    async def _run_command_and_function(
        self, function: str, command: str
    ) -> Tuple[bool, str, dict]:
        """
        Helper function to execute the terminal command and then run and verify the function.
        """
        # Run the terminal command if provided.
        if command:
            valid, message = self.validate_command(command, self.language)
            if valid:
                term_result = self.runner.terminal(command)
                exit_code = term_result.get("exit_code", 0)
                if exit_code != 0:
                    return (
                        False,
                        f"Terminal command execution failed with exit code {exit_code}",
                        None,
                    )

        # Validate the function code.
        valid, message = self.validate_fn(function, self.language)
        if not valid:
            return False, message, None

        # Run the function.
        result = self.runner.run(function)
        output = result.get("stdout", "")
        exit_code = result.get("exit_code", 0)
        if exit_code != 0:
            return (
                False,
                f"Function execution failed with exit code {exit_code}:\n{output}",
                result,
            )

        # Verify the output.
        valid, message = self.optimizer.verify(self.test_cases, output)
        return valid, message, result

    async def baseline(self):
        self.logger.log("Generating baseline solution.", "info")
        response = self.optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]

        self.logger.log("Baseline solution generated.", "info")
        self.logger.log(f"\n{function}", "debug")
        self.logger.log(f"\n{command}", "debug")

        valid, message, result = await self._execute_and_verify(
            function,
            command,
        )

        if not valid:
            self.logger.log(message, "error")
            self.logger.log("Baseline solution failed. Exiting process.", "error")
            return
        else:
            self.logger.log("Function execution successful.", "info")

        metrics = self.get_metrics(result)

        self.logger.log("Performance metrics:", "debug")
        self.logger.log(f"Runtime: {metrics['runtime']}", "debug")
        self.logger.log(f"CPU Percent: {metrics['cpu_percent']}", "debug")
        self.logger.log(f"Memory Usage: {metrics['memory_usage']}", "debug")
        self.logger.log("=" * 100, "info")

        self.root = FunctionNode(self.description, function, metrics)
        self.curr = self.root
        self.generation = 1

    async def evolve(self):
        self.logger.log("=" * 100, "info")
        self.logger.log(f"Generation {self.generation}", "info")

        function = self.root.solution

        self.logger.log("Generating approaches.", "info")
        generate_approaches_response = self.optimizer.approach(function)
        self.logger.log("Approaches generated.", "info")

        for idx, approach in enumerate(generate_approaches_response["approaches"]):
            approach_description = approach["description"]
            self.logger.log(" ", "info")
            self.logger.log(f"Approach {idx+1}: {approach_description}", "debug")
            self.logger.log("Generating solution.", "info")
            solution = self.optimizer.solution(function, approach_description)
            function = solution["function_implementation"]
            command = solution["terminal_command"]
            self.logger.log("Solution generated.", "info")
            self.logger.log(f"\n{function}", "debug")
            self.logger.log(f"\n{command}", "debug")
            valid, message, result = await self._execute_and_verify(function, command)

            if not valid:
                self.logger.log(message, "error")
                self.logger.log(
                    f"Solution failed after {self.max_retries} retries. Skipping approach.",
                    "error",
                )
                continue

            metrics = self.get_metrics(result)

            self.logger.log("Performance metrics:", "debug")
            self.logger.log(f"Runtime: {metrics['runtime']}", "debug")
            self.logger.log(f"CPU Percent: {metrics['cpu_percent']}", "debug")
            self.logger.log(f"Memory Usage: {metrics['memory_usage']}", "debug")
            self.logger.log(" ", "info")

            child = FunctionNode(approach_description, function, metrics, self.curr)
            self.curr.add_child(child)

        self.logger.log("Generation complete.", "info")
        self.logger.log(" ", "info")

        # Check if the root metrics are better than the children
        if all(
            [
                self.curr.metrics["runtime"] <= child.metrics["runtime"]
                for child in self.curr.children
            ]
        ):
            self.logger.log("Root is better than all children.", "info")
            return False

        winner = self.winner(self.curr.children)
        self.curr = winner
        self.generation += 1

        self.logger.log("Winner selected.", "info")
        self.logger.log(winner.solution, "debug")
        self.logger.log("Performance metrics:", "debug")
        self.logger.log(f"Runtime: {winner.metrics['runtime']}", "debug")
        self.logger.log(f"CPU Percent: {winner.metrics['cpu_percent']}", "debug")
        self.logger.log(f"Memory Usage: {winner.metrics['memory_usage']}", "debug")
        self.logger.log("=" * 100, "info")

        return True

    @staticmethod
    def get_metrics(result: dict):
        return {
            "runtime": result.get("runtime", float("inf")),
            "cpu_percent": result.get("cpu_percent", float("inf")),
            "memory_usage": result.get("memory_usage", float("inf")),
        }

    @staticmethod
    def winner(nodes: list[FunctionNode]) -> dict:
        return min(nodes, key=lambda x: x.metrics["runtime"])
