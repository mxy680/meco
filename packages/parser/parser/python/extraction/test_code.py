from typing import Any, Dict, List
from parser.utils import generate_args_hash


def extract_test_code(fn: dict, test_cases: list[dict]) -> str:
    """
    Converts and validates test cases for a given function.

    Args:
        fn (dict): Function metadata (e.g., name, parameters).
        test_cases (List[Dict]): List of test cases with inputs, expected_output, expected_type.

    Returns:
        List[Dict]: A structured list of test cases ready for execution.
    """
    aggregated_cases = []

    for case in test_cases:
        args, args_hash = generate_args_hash(case)
        statement = f"        results['{args_hash}'] = {fn['name']}({args})"
        aggregated_cases.append(statement)

    return "\n".join(aggregated_cases)
