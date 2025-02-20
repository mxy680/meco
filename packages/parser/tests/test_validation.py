from parser.python import validate_python_fn
from parser.python import validate_python_test_cases


def test_validate_python_fn():
    fn = """
    def print_message(message):
        print(message)
    """
    assert validate_python_fn(fn)


def test_validate_python_fn_2():
    fn = """
    import numpy as np
    
    def print_message(message):
        print(message)
    """
    assert isinstance(validate_python_fn(fn), Exception)


def test_validate_python_fn_3():
    fn = """
    def print_message(message):
        print(message)
        
    def print_message_2(message):
        print(message)
    """
    assert isinstance(validate_python_fn(fn), Exception)
