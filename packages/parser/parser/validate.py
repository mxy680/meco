from parser.python import (
    validate_python_fn,
    validate_python_signature,
)

from typing import Tuple


def validate_fn(code: str, lang: str) -> Tuple[bool, str]:
    match lang:
        case "python":
            return validate_python_fn(code)
        case _:
            return False


def validate_signature(signature: str, test_cases: list, lang: str) -> Tuple[bool, str]:
    match lang:
        case "python":
            return validate_python_signature(signature, test_cases)
        case _:
            return False
