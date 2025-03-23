from ..types import TYPE_MAP
from ..extraction.fn import extract_fn
from typing import Tuple


class InvalidSignatureException(Exception):
    """Raised when the function signature is invalid."""

    def __init__(self, message="The function signature is invalid"):
        self.message = message
        super().__init__(self.message)


def validate_signature(signature: str, test_cases: list) -> Tuple[bool, str]:
    """
    Validate the function signature given the test cases.
    """
    # Create signature into empty function (using pass)
    fn_code = f"{signature}:\n    pass"

    # Parse function with tree-sitter
    try:
        fn = extract_fn(fn_code)
    except Exception as e:
        return False, str(e)

    args = fn["params"].split(", ")

    # Check return type validity
    if TYPE_MAP.get(fn["return_type"], "None") == "None":
        return False, "Please declare a valid return type"

    for arg in args:
        # Check if argument is optional
        optional = "=" in arg
        if optional:
            arg = arg.split("=")[0].strip()

        # Check if argument has declared type
        if ":" in arg:
            arg_name = arg.split(":")[0].strip()
            arg_type = arg.split(":")[1].strip()
        else:
            arg_name = arg
            arg_type = None

        for case in test_cases:
            # Check if argument is in test case
            if arg_name not in case["inputs"]:
                if not optional:
                    return (
                        False,
                        f"Argument {arg_name} not found in test case: {case["inputs"]}",
                    )
                continue

            # Check if argument type is correct
            if arg_type and arg_type != case["input_types"][arg_name]:
                return (
                    False,
                    f"Argument {arg_name} type does not match test case: {case["inputs"]}",
                )

            # Check if argument type is valid
            if fn["return_type"] != test_cases[0]["expected_output_type"]:
                return False, f"Return type does not match test case: {case["inputs"]}"

    return True, "Signature is valid"
