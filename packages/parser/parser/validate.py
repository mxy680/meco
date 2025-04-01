from parser.python.command import validate_command as validate_python_command
from parser.python.function import (
    validate_signature as validate_python_signature,
    validate_function as validate_python_function,
)
from parser.python.test_cases import validate_test_cases as validate_python_test_cases
from parser.python.output import validate_output as validate_python_output


def validate_signature(signature: str, lang: str) -> None:
    match lang:
        case "python":
            return validate_python_signature(signature)
        case _:
            return False


def validate_function(code: str, lang: str) -> None:
    match lang:
        case "python":
            return validate_python_function(code)
        case _:
            return False


def validate_command(command: str, lang: str) -> None:
    match lang:
        case "python":
            return validate_python_command(command)
        case _:
            return False


def validate_test_cases(params: str, test_cases: list[dict], lang: str) -> None:
    match lang:
        case "python":
            return validate_python_test_cases(params, test_cases)
        case _:
            return False


def validate_output(test_cases: list[dict], output: dict, lang: str) -> None:
    match lang:
        case "python":
            return validate_python_output(test_cases, output)
        case _:
            return False
