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

    optimizer = OllamaOptimizer(request.signature, language, request.models, test_code)
    response = optimizer.base()

    # Validate the base function
    if not validate_fn(response["function_implementation"], language):
        raise Exception("Invalid base function")

    # Run the base function
    runner = Runner(language)
    runner.start_container()

    result = runner.run(response["function_implementation"], test_code)
    output = result.get("stdout", "")

    if isinstance(output, str):
        raise Exception(f"Invalid output format: \n{output}")

    for case in request.test_cases:
        args = ", ".join([f"{k}={v}" for k, v in case.inputs.items()])
        if not output[args] == case.expected_output:
            raise Exception(f"Invalid output for case: {case}")
