from parser.lang.python import extract_python_fn


def test_extract_python_fn():
    fn = """
    def print_message(message):
        print(message)
    """
    print(extract_python_fn(fn))
    
