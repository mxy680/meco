from parser.lang.python import extract_python_fn


def test_extract_python_fn():
    fn_code = """
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
    """
    fn = extract_python_fn(fn_code)
    print()
    print(fn['script'])