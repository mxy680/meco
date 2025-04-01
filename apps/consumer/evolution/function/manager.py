from typing import AsyncGenerator
from parser.extract import extract_signature, extract_test_cases
from parser.validate import validate_function
from .execution import execute_and_verify
from .tree import Tree
from .metrics import get_metrics
from operator import itemgetter


class EvolutionManager:
    def __init__(
        self,
        signature: str,  # Assumes validity.
        description: str,
        language: str,
        model: str,  # Each model has independent evolution manager.
        test_cases: list,  # For output verification.
        optimizer,  # For generating optimized code.
        runner,  # For executing code.
        num_approaches: int = 3,
        max_retries: int = 3,
    ):
        self.signature = signature
        self.description = description
        self.language = language
        self.model = model
        self.test_cases = test_cases
        self.optimizer = optimizer
        self.runner = runner
        self.num_approaches = num_approaches
        self.max_retries = max_retries

        self.generation = 1
        self.tree = Tree()

    async def baseline(self) -> AsyncGenerator[dict, None]:
        child_idx = -1
        curr_idx = 0
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=True,
            approach="Naive solution",
            status="running",
        )

        response = self.optimizer.baseline()
        function = response["function_implementation"]
        command = response["terminal_command"]

        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=True,
            function=function,
            command=command,
        )

        async for update, job in execute_and_verify(
            self, function, command, curr_idx, child_idx
        ):
            yield job

        function, command, valid = itemgetter("function", "command", "valid")(update)

        # Check for failure in baseline execution.
        if not valid:
            self.tree.curr[curr_idx].fail()
            return

        # Input generator step.
        response = self.optimizer.generate_inputs(function)
        input_generator = response["input_generator_function"]
        try:
            validate_function(function, self.language)
            result = self.runner.run_input_generator(function, input_generator)
            output = result.get("stdout")
            if result.get("exit_code") != 0:
                return

            # Extract the function properties: name, return type, and params
            fn = extract_signature(self.signature, self.language)
            name = fn["name"]
            self.test_cases = output
            self.runner.test_code = extract_test_cases(
                name, self.test_cases, self.language
            )
        except:
            pass

        # Run the baseline on the new test cases
        async for update, job in execute_and_verify(
            self, function, command, curr_idx, child_idx
        ):
            yield job

        function, command, valid, result = itemgetter(
            "function", "command", "valid", "result"
        )(update)

        # Check for failure in baseline execution.
        if not valid:
            self.tree.curr[curr_idx].fail()
            self.tree.stop()
            return

        metrics = get_metrics(result)
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            metrics=metrics,
            status="complete",
        )

    async def evolve(self) -> AsyncGenerator[dict, None]:
        """
        Evolves the current solutions by generating, verifying, and selecting improved approaches.
        """
        if not self.tree.curr:
            yield False
            return

        self.generation += 1

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
                    function=function,
                    command=command,
                )

                async for update, job in execute_and_verify(
                    self, function, command, curr_idx, child_idx
                ):
                    yield job
                    
                print(update.get("valid"))
                print(update.get("result") if isinstance(update.get("result"), str) else "No result")

                if not update.get("valid"):
                    self.tree.get_child(curr_idx=curr_idx, child_idx=child_idx).fail()
                else:
                    metrics = get_metrics(update.get("result"))
                    yield self.tree.update(
                        curr_idx=curr_idx,
                        child_idx=child_idx,
                        metrics=metrics,
                        status="complete",
                    )

            winners = self.tree.winners(curr_idx=curr_idx)
            if not winners:
                self.tree.stop()
            else:
                yield self.tree.update(
                    curr_idx=curr_idx,
                    child_idx=-1,
                    status="complete",
                )
                self.tree.move_winners_to_curr(
                    curr_idx, [winner.child_idx for winner in winners]
                )
