import pytest
import docker
from runner.client import Runner
from optimizer.optimizer import optimize_function
from parser.validate import validate_fn
from parser.extract import extract_fn

@pytest.fixture(scope="module")
def runner():
    """Fixture to initialize Runner once and reuse the same container."""
    r = Runner("python")
    r.start_container()
    yield r  # Provide the runner instance to tests
    # r.stop_container()  # Stop container after all tests


def test_function(runner):
    function_code = "def gcd(a, b):\n\tif b == 0:\n\t\treturn a\n\treturn gcd(b, a % b)"
    language = "python"
    models = ["codellama"]
    
    # Validate and Extract the original function
    assert validate_fn(function_code, language)
    fn = extract_fn(function_code, language)
    
    # Run the original function
    result = runner.run(function_code, fn, test_cases=["50000000, 10002301230123012301301230123123120312031203"])
    print(result)

    solutions = optimize_function(function_code, language, models)
    for model, value in solutions.items():
        print(f"Model: {model}\nCode: {value['code']}\n")
        assert value["code"]
                
        # Validate and Extract the optimized function
        assert validate_fn(value["code"], language)
        fn = extract_fn(value["code"], language)
        
        # Run the optimized function
        result = runner.run(value["code"], fn, test_cases=["5,10"])
        print(result)
