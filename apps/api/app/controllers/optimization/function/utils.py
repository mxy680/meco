from optimizer.function.client import FunctionOptimizer
from runner.function.client import Runner
from typing import Tuple


def execute_and_verify(
    function: str,
    command: str,
    optimizer: FunctionOptimizer,
    runner: Runner,
    test_cases: list[dict],
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
