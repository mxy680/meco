from optimizer.function.client import FunctionOptimizer
from runner.function.client import Runner
from typing import Tuple
from .tree import Tree
from typing import AsyncGenerator


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

        self.generation: int = 0
        self.tree = Tree()
        
    async def _execute_and_verify(
        self,
        function: str,
        command: str,
        idx: int,
    ) -> AsyncGenerator[dict, None]:
        """
        Execute terminal command (if provided) and run the function.
        Returns a tuple: (valid, message, result)
        """
        yield self.tree.update(
            idx=idx,
            message="optimization process started",
            return_update=True,
        )

        valid, message, result = await self._run_command_and_function(function, command)

        yield self.tree.update(
            idx=idx,
            valid=valid,
            message=message,
            result=result,
            return_update=True,
        )

        retry = 0
        while not valid and retry < self.max_retries:
            retry += 1

            yield self.tree.update(
                idx=idx,
                message=f"retrying optimization process ({retry}/{self.max_retries})",
                retrying=True,
                return_update=True,
            )

            response = self.optimizer.fix(function, message)
            function = response["function_implementation"]
            command = response["terminal_command"]

            yield self.tree.update(
                idx=idx,
                message="function/command generated",
                function=function,
                command=command,
                return_update=True,
            )

            valid, message, result = await self._run_command_and_function(
                function, command
            )

            yield self.tree.update(
                idx=idx,
                valid=valid,
                message=message,
                result=result,
                return_update=True,
            )

        yield self.tree.update(
            idx=idx,
            valid=valid,
            retrying=False,
            return_update=True,
        )

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
        idx = -1
        self.generation = 1
        yield self.tree.update(
            idx=idx,
            valid=True,
            approach=self.description,
            message="baseline optimization process started",
            status="running",
        )

        response = self.optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]

        yield self.tree.update(
            idx=idx,
            valid=True,
            message="function/command generated",
            function=function,
            command=command,
        )

        async for update, job in self._execute_and_verify(function, command, idx=idx):
            yield job

        if not update["valid"]:
            self.tree.curr.fail()
            return

        metrics = self.get_metrics(update["result"])

        yield self.tree.update(
            idx=idx,
            message="metrics collected, baseline optimization complete",
            metrics=metrics,
            status="complete",
        )

    async def evolve(self):
        self.generation += 1
        self.tree.add_nodes(self.num_approaches)
        function = self.tree.curr.function

        generate_approaches_response = self.optimizer.approach(function)

        for idx, approach in enumerate(generate_approaches_response["approaches"]):
            yield self.tree.update(
                idx=idx,
                valid=True,
                message=f"approach {idx} generated",
                approach=approach["description"],
                status="running",
            )

        for idx, approach in enumerate(generate_approaches_response["approaches"]):
            solution = self.optimizer.solution(function, approach["description"])
            function = solution["function_implementation"]
            command = solution["terminal_command"]

            yield self.tree.update(
                idx=idx,
                message="function/command generated",
                function=function,
                command=command,
            )

            async for update, job in self._execute_and_verify(
                function, command, idx=idx
            ):
                yield job

            if not update["valid"]:
                self.tree.get_child(idx).fail()
                continue

            metrics = self.get_metrics(update["result"])

            yield self.tree.update(
                idx=idx,
                message=f"metrics collected, approach {idx} complete",
                metrics=metrics,
                status="complete",
            )

        # Find Winner
        winner = self.tree.winner()
        if len(winner.children) > 0:
            yield self.tree.update(
                idx=-1,
                message="no improvements found, evolution complete",
                status="complete",
            )
            yield False
        else:
            yield self.tree.update(
                idx=-1,
                message=f"winner found, evolution complete",
                status="complete",
            )

            self.tree.move_to_winner(winner.child_idx)

    @staticmethod
    def get_metrics(result: dict):
        return {
            "runtime": result.get("runtime", float("inf")),
            "cpu_percent": result.get("cpu_percent", float("inf")),
            "memory_usage": result.get("memory_usage", float("inf")),
        }

    @staticmethod
    def winner(nodes: list[dict]) -> dict:
        # Get the best node based on the metrics
        winner = nodes[0]
        for node in nodes:
            if node["metrics"]["runtime"] < winner["metrics"]["runtime"]:
                winner = node
        return winner
