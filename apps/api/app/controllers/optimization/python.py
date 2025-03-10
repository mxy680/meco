from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_test_code, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
import json

language = "python"


async def optimize_python(request: OptimizationRequest):
    # Validate and extract the original function
    validate_signature(request.signature, request.test_cases, language)
    print("\n\n✅ Signature validation passed.")

    # Get the signature properties
    fn = extract_signature(request.signature, language)

    # Extract the test cases as an aggregated string
    test_code = extract_test_code(fn, request.test_cases, language)
    print("✅ Test case extraction passed.")

    for model in request.models:
        # Declare optimizer and get baseline function
        optimizer = OpenAIOptimizer(request.signature, language, model, test_code)
        response = optimizer.baseline()
        print(response['function_implementation'])
