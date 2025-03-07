from ..types import TYPE_MAP
from ..extraction.fn import extract_fn
from typing import Union


class InvalidSignatureException(Exception):
    """Raised when the function signature is invalid."""

    def __init__(self, message="The function signature is invalid"):
        self.message = message
        super().__init__(self.message)


def validate_signature(
    signature: str, test_cases: list
) -> Union[True, InvalidSignatureException]:
    """
    Validate the function signature given the test cases.
    """
    # Create signature into empty function (using pass)
    fn_code = f"{signature}:\n    pass"

    # Parse function with tree-sitter
    fn = extract_fn(fn_code)
    args = fn["params"].split(", ")

    # Check return type validity
    if TYPE_MAP.get(fn["return_type"], "None") == "None":
        raise InvalidSignatureException("Please declare a valid return type")

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
            if arg_name not in case.inputs:
                if not optional:
                    raise InvalidSignatureException(
                        f"Argument {arg_name} not found in test case: {case.inputs}"
                    )
                continue

            # Check if argument type is correct
            if arg_type and arg_type != case.input_types[arg_name]:
                raise InvalidSignatureException(
                    f"Argument {arg_name} type does not match test case: {case.inputs}"
                )

            # Check if argument type is valid
            if fn["return_type"] != test_cases[0].expected_output_type:
                raise InvalidSignatureException(
                    "Return type does not match test case: {case.inputs}"
                )

    return True
