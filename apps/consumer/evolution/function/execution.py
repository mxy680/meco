from typing import AsyncGenerator, Tuple, Union
from parser.validate import validate_function, validate_command, validate_output


async def execute_and_verify(
    self, function: str, command: str, curr_idx: int, child_idx: int
) -> AsyncGenerator[dict, None]:
    # Execute the function and command
    valid, result = await run_command_and_function(self, function, command)
    yield self.tree.update(
        curr_idx=curr_idx,
        child_idx=child_idx,
        valid=valid,
        result=result,
        return_update=True,
    )

    retry = 0
    while not valid and retry < self.max_retries:
        retry += 1
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            retrying=True,
            return_update=True,
        )

        response = self.optimizer.fix(function, result)
        function = response["function_implementation"]
        command = response["terminal_command"]

        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            function=function,
            command=command,
            return_update=True,
        )

        valid, result = await run_command_and_function(self, function, command)
        yield self.tree.update(
            curr_idx=curr_idx,
            child_idx=child_idx,
            valid=valid,
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


async def run_command_and_function(
    self, function: str, command: str
) -> Tuple[bool, Union[str, None]]:
    """
    Executes the terminal command (if provided) and runs the function.
    Returns a tuple: (valid, message, result).
    """
    if command:
        try:
            validate_command(command, self.language)
        except Exception as e:
            return False, str(e)

        term_result = self.runner.run_terminal(command)
        if term_result.get("exit_code") != 0:
            output = term_result.get("stdout")
            return False, output
    try:
        validate_function(function, self.language)
    except Exception as e:
        return False, str(e)

    function_result = self.runner.run_code(function)
    output = function_result.get("stdout")
    if function_result.get("exit_code") != 0:
        return False, output

    try:
        validate_output(self.test_cases, output, self.language)
    except Exception as e:
        return False, str(e)

    return True, function_result
