from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn, validate_test_cases
from parser.extract import extract_fn, extract_test_code
import json


async def optimize_function(request: OptimizationRequest, language: str):
    # Validate and extract the original function
    is_fn_valid = validate_fn(request.function_code, language)
    if isinstance(is_fn_valid, Exception):
        return is_fn_valid

    # Get the function properties
    fn = extract_fn(request.function_code, language)

    # Validate the test cases
    is_test_cases_valid = validate_test_cases(fn, request.test_cases, language)
    if isinstance(is_test_cases_valid, Exception):
        return is_test_cases_valid

    # Extract the test cases as an aggregated string
    test_code = extract_test_code(fn, request.test_cases, language)

    # Run the original function
    runner = Runner(language)
    runner.start_container()

    result = runner.run(request.function_code, fn, test_code)
    runtime = result.get("runtime", 0)
    cpu_percent = result.get("cpu_percent", 0)
    memory_usage = result.get("memory_usage", 0)
    output = result.get("stdout", "")
    print(f"\nOriginal Function:\n{request.function_code}\n")
    print(f"Runtime:", runtime)
    print(f"\nCPU Percent: {cpu_percent}")
    print(f"Memory Usage: {memory_usage}")
    print(f"\nOutput:\n{output}")
    print("-" * 50)

    # return {
    #     "cpu_percent": cpu_percent,
    #     "memory_usage": memory_usage,
    #     "runtime": stdout["runtime"],
    # }

    # solutions = optimize_function(
    #     request.function_code, language, request.models, stream=True
    # )

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
