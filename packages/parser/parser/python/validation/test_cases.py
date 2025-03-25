import hashlib
from typing import Tuple


def validate_test_cases(fn: dict, test_cases: list[dict]) -> Tuple[bool, str]:
    """
    Converts and validates test cases for a given function.

    Args:
        fn (dict): Function metadata (e.g., name, parameters).
        test_cases (List[Dict]): List of test cases with inputs, expected_output, expected_type.

    Returns:
        List[Dict]: A structured list of test cases readyfor execution.
    """
    params = [p.strip() for p in fn["params"].split(",")]
    for case in test_cases:
        if (
            case.get("expected_output_type") is None
            or case.get("input_types") is None
            or case.get("inputs") is None
            or case.get("expected_output") is None
        ):
            return (
                False,
                "Expected output type, input types, inputs, or expected output is missing.",
            )

        # Check expected output type
        if not isinstance(case["expected_output"], eval(case["expected_output_type"])):
            return False, "Mismatched expected output type."

        if len(case["input_types"].items()) != len(case["inputs"].items()):
            return False, "Mismatched input types and inputs."

        for idx, ((arg1, value), (arg2, value_type)) in enumerate(
            zip(case["inputs"].items(), case["input_types"].items())
        ):
            # Check if the keys match
            if arg1 != arg2:
                return False, f"Arg mismatch: {arg1} != {arg2}"

            # Check if the types match
            if not isinstance(value, eval(value_type)):
                return False, f"Type mismatch: {value} != {value_type}"

            # Check if the input type matches the function signature
            if params[idx].split(":")[1].strip() != value_type:
                return (
                    False,
                    f"Input type mismatch: {params[idx].split(':')[1].strip()} != {value_type}",
                )

            # Check if the input key matches the function signature
            if params[idx].split(":")[0].strip() != arg1:
                return (
                    False,
                    f"Input key mismatch: {params[idx].split(':')[0].strip()} != {arg1}",
                )

    return True, "All test cases are valid."
