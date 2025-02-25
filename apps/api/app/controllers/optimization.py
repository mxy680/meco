from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_test_code, extract_signature
from optimizer.ollama import OllamaOptimizer


async def optimize(request: OptimizationRequest, language: str):
    print("\n🚀 Starting Optimization Process...")

    # Validate and extract the original function
    print("\n✅ Validating function signature...")
    validate_signature(request.signature, request.test_cases, language)

    # Get the signature properties
    fn = extract_signature(request.signature, language)

    # Extract the test cases as an aggregated string
    test_code = extract_test_code(fn, request.test_cases, language)

    # Initialize the optimizer
    print("\n⚙️ Initializing the optimizer...")
    optimizer = OllamaOptimizer(
        request.signature, language, request.models, request.test_cases, test_code
    )

    print("\n🔎 Generating Baseline Implementation...")
    response = optimizer.baseline()

    # # Validate the baseline function
    function = response["function_implementation"]
    print("\n📝 Baseline Function Generated:\n", function)
    print("\n📄 Baseline Function Description:\n", response["description"])

    # Initialize the runner
    runner = Runner(language)
    runner.start_container()

    