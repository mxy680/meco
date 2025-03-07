from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_test_code, extract_signature
from optimizer.ollama.python.client import OllamaPythonOptimizer
from optimizer.openai.python.client import OpenAIOptimizer

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

    # Declare optimizer and get baseline function
    optimizer = OpenAIOptimizer(
        request.signature, request.models, request.test_cases, test_code
    )
    response = optimizer.baseline()
    print(response)
