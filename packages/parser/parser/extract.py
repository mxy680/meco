from parser.python.function import (
    extract_signature as extract_python_signature,
)
from parser.python.test_cases import (
    extract_test_cases as extract_python_test_cases,
)


def extract_test_cases(fn_name: str, test_cases: list, lang: str) -> str:
    match lang:
        case "python":
            return extract_python_test_cases(fn_name, test_cases)
        case _:
            return []


def extract_signature(signature: str, lang: str) -> dict:
    match lang:
        case "python":
            return extract_python_signature(signature)
        case _:
            return {}
