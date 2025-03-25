import hashlib
import json
from parser.utils import generate_args_hash


def extract_test_code(fn: dict, test_cases: list[dict]) -> str:
    """
    Converts and validates test cases for a given function.

    Args:
        fn (dict): Function metadata (e.g., name, parameters).
        test_cases (List[Dict]): List of test cases with inputs, expected_output, expected_type.

    Returns:
        str: The generated test code as a string.
    """
    aggregated_cases = ["# Test cases"]

    for case in test_cases:
        args, args_hash = generate_args_hash(case)
        statement = f"            results['{args_hash}'] = {fn['name']}({args})"
        aggregated_cases.append(statement)

    test_code = "\n".join(aggregated_cases)
    return test_code
