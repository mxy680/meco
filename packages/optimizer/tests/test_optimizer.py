import pytest
from optimizer.optimizer import optimize_function
from optimizer.query.ollama import query_ollama


def test_optimize_function():
    """Test if optimize_function returns a valid optimized function."""
    function_code = "def add_one(x): return x + 1"
    language = "python"

    optimized_code = optimize_function(function_code, language)
    print(f"Optimized function: {optimized_code}")
