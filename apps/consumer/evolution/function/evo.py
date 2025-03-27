from runner.function.client import Runner
from typing import Tuple, AsyncGenerator, List, Dict, Any, Callable
from .tree import Tree


class EvolutionManager:
    def __init__(
        self,
        signature: str,  # Assumes validity.
        description: str,
        language: str,
        model: str,  # Each model has independent evolution manager.
        test_cases: List[dict],  # For output verification.
        test_code: str,  # For script injection.
        optimizer,  # For generating optimized code.
        runner: Runner,  # For executing code.
        validate_fn: Callable,  # For validating a function.
        validate_command: Callable,  # For validating a command.
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

        self.generation = 0
        self.tree = Tree()

    async def _execute_and_verify(
        self, function: str, command: str, curr_idx: int, child_idx: int
    ) -> AsyncGenerator[dict, None]:
        """
        Execute a terminal command (if provided) and run the function.
        Yields updates from the tree as the process progresses.
        """
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            message="optimization process started",
            return_update=True,
        )

        valid, message, result = await self._run_command_and_function(function, command)
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=valid,
            message=message,
            result=result,
            return_update=True,
        )

        retry = 0
        while not valid and retry < self.max_retries:
            retry += 1
            yield self.tree.update(
                curr_idx=curr_idx,
                child_idx=child_idx,
                message=f"retrying optimization process ({retry}/{self.max_retries})",
                retrying=True,
                return_update=True,
            )

            response = self.optimizer.fix(function, message)
            function = response["function_implementation"]
            command = response["terminal_command"]

            yield self.tree.update(
                curr_idx=curr_idx,
                child_idx=child_idx,
                message="function/command generated",
                function=function,
                command=command,
                return_update=True,
            )

            valid, message, result = await self._run_command_and_function(
                function, command
            )
            yield self.tree.update(
                curr_idx=curr_idx,
                child_idx=child_idx,
                valid=valid,
                message=message,
                result=result,
                return_update=True,
            )

        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=valid,
            retrying=False,
            return_update=True,
        )

    async def _run_command_and_function(
        self, function: str, command: str
    ) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Executes the terminal command (if provided) and runs the function.
        Returns a tuple: (valid, message, result).
        """
        if command:
            valid, message = self.validate_command(command, self.language)
            if valid:
                term_result = self.runner.terminal(command)
                if term_result.get("exit_code", 0) != 0:
                    return (
                        False,
                        f"Terminal command execution failed with exit code {term_result.get('exit_code')}",
                        None,
                    )

        valid, message = self.validate_fn(function, self.language)
        if not valid:
            return False, message, None

        result = self.runner.run(function)
        output = result.get("stdout")
        if result.get("exit_code") != 0:
            return (
                False,
                f"Function execution failed with exit code {result.get('exit_code')}:\n{output}",
                result,
            )

        valid, message = self.optimizer.verify(self.test_cases, output)
        return valid, message, result

    async def baseline(self) -> AsyncGenerator[dict, None]:
        """
        Generates and verifies the baseline solution.
        """
        child_idx = -1
        curr_idx = 0
        self.generation = 1
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=True,
            approach=self.description,
            message="baseline optimization process started",
            status="running",
        )

        response = self.optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]

        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=True,
            message="function/command generated",
            function=function,
            command=command,
        )

        async for update, job in self._execute_and_verify(
            function, command, curr_idx, child_idx
        ):
            yield job

        if not update.get("valid"):
            self.tree.curr[curr_idx].fail()
            return

        metrics = self.get_metrics(update.get("result"))
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            message="metrics collected, baseline optimization complete",
            metrics=metrics,
            status="complete",
        )

    async def evolve(self) -> AsyncGenerator[dict, None]:
        """
        Evolves the current solutions by generating, verifying, and selecting improved approaches.
        """
        self.generation += 1
        if not self.tree.curr:
            yield False
            return

        for curr_idx in range(len(self.tree.curr)):
            self.tree.add_nodes(curr_idx=curr_idx, n=self.num_approaches)
            function = self.tree.curr[curr_idx].function

            generate_approaches_response = self.optimizer.approach(function)

            for child_idx, approach in enumerate(
                generate_approaches_response["approaches"]
            ):
                yield self.tree.update(
                    curr_idx=curr_idx,
                    child_idx=child_idx,
                    valid=True,
                    message=f"approach {child_idx} generated",
                    approach=approach["description"],
                    status="running",
                )

            for child_idx, approach in enumerate(
                generate_approaches_response["approaches"]
            ):
                solution = self.optimizer.solution(function, approach["description"])
                function = solution["function_implementation"]
                command = solution["terminal_command"]

                yield self.tree.update(
                    curr_idx=curr_idx,
                    child_idx=child_idx,
                    message="function/command generated",
                    function=function,
                    command=command,
                )

                async for update, job in self._execute_and_verify(
                    function, command, curr_idx, child_idx
                ):
                    yield job

                if not update.get("valid"):
                    self.tree.get_child(curr_idx=curr_idx, child_idx=child_idx).fail()
                    continue

                metrics = self.get_metrics(update.get("result"))
                yield self.tree.update(
                    curr_idx=curr_idx,
                    child_idx=child_idx,
                    message=f"metrics collected, approach {child_idx} complete",
                    metrics=metrics,
                    status="complete",
                )

            winners = self.tree.winners(curr_idx=curr_idx)
            if not winners:
                self.tree.no_winner(curr_idx)
            else:
                yield self.tree.update(
                    curr_idx=curr_idx,
                    child_idx=-1,
                    message="winners found, evolution complete",
                    status="complete",
                )
                self.tree.move_winners_to_curr(
                    curr_idx, [winner.child_idx for winner in winners]
                )

    @staticmethod
    def get_metrics(result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extracts metrics from the result.
        """
        return {
            "runtime": result.get("runtime", float("inf")),
            "cpu_percent": result.get("cpu_percent", float("inf")),
            "memory_usage": result.get("memory_usage", float("inf")),
        }
