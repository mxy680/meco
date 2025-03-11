from app.models import OptimizationRequest
from runner.function.client import Runner
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

    # Initialize the runner
    runner = Runner(language, test_code)
    runner.start_container()

    for model in request.models:
        # Declare optimizer and get baseline function
        optimizer = OpenAIOptimizer(request.signature, request.description, language, model, test_code)
        response = optimizer.baseline()
        function = response["function_implementation"]

        # Validate the function
        validate_fn(function, language)

        # Run the baseline function
        result = runner.run_script(function)
        output = result.get("stdout", "")

        # Verify the output
        valid, message = optimizer.verify(request.test_cases, output)
        while not valid:
            print(f"❌ Model {model} failed: {message}")
            response = optimizer.fix(function, message)
            function = response["function_implementation"]

            # Validate the function
            validate_fn(function, language)

            # Run the fixed function
            result = runner.run_script(response["function_implementation"])
            output = result.get("stdout", "")

            # Verify the output
            valid, message = optimizer.verify(request.test_cases, output)
        
        print(f"✅ Model {model} passed!")

        # Generate n approaches
        response = optimizer.approach(function)
        for approach in response['approaches']:
            # Generate a solution for each approach
            response = optimizer.solution(function, approach)
            print(f"🚀 Approach: {approach['description']}")
            print()
            print(f"💡 Solution: \n")
            print("Terminal Command: ", response["terminal_command"])
            print("Function Implementation: \n", response["function_implementation"])
