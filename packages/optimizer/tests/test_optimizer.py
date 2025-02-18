from optimizer.optimizer import optimize_function
from optimizer.query.ollama import query_ollama


def test_optimize_function_add():
    """Test if optimize_function returns a valid optimized function."""
    function_code = "def fibonacci(n):\nif n <= 1:\n\treturn n\nreturn fibonacci(n - 1) + fibonacci(n - 2)"
    language = "python"
    models = ["codellama"]

    response = optimize_function(function_code, language, models)
    print(f"Optimized function:\n {response[models[0]]['code']}")
