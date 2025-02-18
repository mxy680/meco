from parser.lang.python import validate_python_fn

def validate_fn(code: str, lang: str) -> bool:
    match lang:
        case "python":
            return validate_python_fn(code)
        case _:
            return False