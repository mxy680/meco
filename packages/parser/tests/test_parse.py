from parser.lang.python import extract_python_fn


def test_extract_python_fn():
    fn = """
    def print_message(message, times):
        for _ in range(times):
            print(message)
    """
    extract_python_fn(fn)
