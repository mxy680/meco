from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_test_code, extract_signature
from optimizer.ollama import OllamaOptimizer


async def optimize(request: OptimizationRequest, language: str):
    # Validate and extract the original function
    validate_signature(request.signature, request.test_cases, language)

    # Get the signature properties
    fn = extract_signature(request.signature, language)

    # Extract the test cases as an aggregated string
    test_code = extract_test_code(fn, request.test_cases, language)

    # # baselineialize the optimizer
    optimizer = OllamaOptimizer(request.signature, language, request.models, test_code)
    # response = optimizer.baseline()

    # # Validate the baseline function
    # baseline_function = response["function_implementation"]
    baseline_function = """
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
        """
    if not validate_fn(baseline_function, language):
        raise Exception("Invalid baseline function")

    # Run the baseline function
    runner = Runner(language)
    runner.start_container()
    result = runner.run(baseline_function, test_code)
    output = result.get("stdout", "")

    if isinstance(output, str):
        raise Exception(f"Invalid output format: \n{output}")

    runner.verify_tests(request.test_cases, output)

    for model in request.models:
        function = baseline_function
        while True:
            response = optimizer.explore(model, function)
            print()
            print(response["optimized_function"])
            print(response["changes"])
            print()
            function = response["optimized_function"]
            if not validate_fn(function, language):
                raise Exception("Invalid optimized function")