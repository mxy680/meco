from parser.python.validation.fn import validate_fn as validate_python_fn
from parser.python.validation.command import validate_command as validate_python_command
from parser.python.validation.signature import (
    validate_signature as validate_python_signature,
)
from parser.python.validation.test_cases import (
    validate_test_cases as validate_python_test_cases,
)

from typing import Tuple


def validate_fn(code: str, lang: str) -> Tuple[bool, str]:
    match lang:
        case "python":
            return validate_python_fn(code)
        case _:
            return False


def validate_command(command: str, lang: str) -> Tuple[bool, str]:
    match lang:
        case "python":
            return validate_python_command(command)
        case _:
            return False


def validate_signature(signature: str, lang: str) -> Tuple[bool, str]:
    match lang:
        case "python":
            return validate_python_signature(signature)
        case _:
            return False


def validate_test_cases(
    fn: dict, test_cases: list[dict], lang: str
) -> Tuple[bool, str]:
    match lang:
        case "python":
            return validate_python_test_cases(fn, test_cases)
        case _:
            return False
