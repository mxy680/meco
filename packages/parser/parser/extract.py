from parser.python.extraction.signature import (
    extract_signature as extract_python_signature,
)
from parser.python.extraction.test_code import (
    extract_test_code as extract_python_test_code,
)
from parser.python.extraction.fn import extract_fn as extract_python_fn


def extract_fn(code: str, lang: str) -> bool:
    match lang:
        case "python":
            return extract_python_fn(code)
        case _:
            return False


def extract_test_code(fn: dict, test_cases: list, lang: str) -> list:
    match lang:
        case "python":
            return extract_python_test_code(fn, test_cases)
        case _:
            return []


def extract_signature(signature: str, lang: str) -> dict:
    match lang:
        case "python":
            return extract_python_signature(signature)
        case _:
            return {}
