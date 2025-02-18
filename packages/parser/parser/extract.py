from parser.lang.python import extract_python_fn

def extract_fn(code: str, lang: str) -> bool:
    match lang:
        case "python":
            return extract_python_fn(code)
        case _:
            return False