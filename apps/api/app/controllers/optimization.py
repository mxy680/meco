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
    # response = optimizer.baseline()

    # # Validate the baseline function
    # function = response["function_implementation"]
    function = """
def matrix_multiply(A: list, B: list) -> list:
    rows_a, cols_a = len(A), len(A[0])
    rows_b, cols_b = len(B), len(B[0])

    if cols_a != rows_b:
        raise ValueError('Invalid matrix dimensions for multiplication')

    result = [[0 for _ in range(cols_b)] for _ in range(rows_a)]

    for i in range(rows_a):
        for j in range(cols_b):
            for k in range(cols_a):
                result[i][j] += A[i][k] * B[k][j]

    return result
    """
    # print("\n📝 Baseline Function Generated:\n", function)
    # print("\n📄 Baseline Function Description:\n", response["description"])

    # Initialize the runner
    runner = Runner(language)
    runner.start_container()

    # # Persist the baseline function
    # result = optimizer.persist(function, validate=validate_fn, runner=runner)

    # # Get the baseline metrics
    # runner.display_metrics(result)

    # Exploration phase
    print("\n🔍 Starting Exploration Phase...")
    for model in request.models:
        response = optimizer.explore(model, function, n=10, gen=1)
        print("\n📈 Exploration Results:")
        for approach in response["approaches"]:
            print("🚀 Approach:", approach["name"].strip())
            print("📄 Description:", approach["description"].strip())
            print()