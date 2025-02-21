from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn, validate_signature
from parser.extract import extract_fn, extract_test_code, extract_signature
import json


async def optimize(request: OptimizationRequest, language: str):
    # Validate and extract the original function
    validate_signature(request.signature, request.test_cases, language)

    # Get the signature properties
    fn = extract_signature(request.signature, language)

    # Extract the test cases as an aggregated string
    test_code = extract_test_code(fn, request.test_cases, language)

    # Run the original function
    runner = Runner(language)
    runner.start_container()

    # solutions = optimize_signature(
    #     request.signature, language, request.models, stream=True
    # )

    # print(solutions)

    # for model, value in solutions.items():
    #     # Validate and extract the optimized function
    #     if not validate_fn(value["code"], language):
    #         print(f"Invalid optimized function for {model}")
    #         continue

    #     fn = extract_fn(value["code"], language)

    #     # Run the optimized function
    #     result = runner.run(fn['script'], request.test_cases)
    #     cpu_percent = result.get("cpu_percent", 0)
    #     memory_usage = result.get("memory_usage", 0)
    #     output = result.get("stdout", "")
    #     print(f"\nCPU Percent: {cpu_percent}, Memory Usage: {memory_usage}")
    #     print(f"\nOutput:", output)
    #     print("-" * 50)
