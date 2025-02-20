from .exceptions import InvalidTestCasesException
from ..types import TYPE_MAP


def validate_test_cases(fn: dict, test_cases: list):
    """
    Validate the test cases against the function signature.

    Args:
        fn (dict): The function signature.
        test_cases (list): The test cases to validate.

    Returns:
        bool: True if the test cases are valid, False otherwise.
    """
    args = fn["params"].split(", ")
    for case in test_cases:
        # Check if the test case has the correct number of inputs
        if len(case.inputs.keys()) != len(args):
            return InvalidTestCasesException(
                "The number of inputs in the test case does not match the function signature."
            )

        # Check if the type of the test case is valid
        for key, value in case.inputs.items():
            if not isinstance(value, TYPE_MAP.get(case.expected_type, None)):
                return InvalidTestCasesException(
                    "The type of the test case input does not match the expected type."
                )

    return True
