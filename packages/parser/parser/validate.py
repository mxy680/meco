from parser.python import validate_python_fn, validate_python_test_cases


def validate_fn(code: str, lang: str) -> bool:
    match lang:
        case "python":
            return validate_python_fn(code)
        case _:
            return False


def validate_test_cases(fn: dict, test_cases: list, lang: str) -> bool:
    match lang:
        case "python":
            return validate_python_test_cases(fn, test_cases)
        case _:
            return False
