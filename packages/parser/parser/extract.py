from parser.python import (
    extract_python_fn,
    extract_python_test_code,
    extract_python_signature,
)


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
