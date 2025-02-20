from app.models import OptimizationRequest
from runner.client import Runner
from parser.validate import validate_fn
from parser.extract import extract_fn
import json


async def optimize_function(request: OptimizationRequest):
    # Validate and extract the original function
    if not validate_fn(request.function_code, request.language):
        return {"error": "Invalid function code."}

    # Get the function properties
    fn = extract_fn(request.function_code, request.language)

    # Run the original function
    runner = Runner(request.language)
    runner.start_container()

    result = runner.run(request.function_code, fn, request.test_cases)
    cpu_percent = result.get("cpu_percent", 0)
    memory_usage = result.get("memory_usage", 0)
    output = result.get("stdout", "")
    print(f"\nOriginal Function:\n{request.function_code}\n")
    print(f"\nCPU Percent: {cpu_percent}, Memory Usage: {memory_usage}")
    try:
        stdout = json.loads(output)
        # print(f"\nOutput:", stdout)
    except:
        print(f"\nOutput:", output)
        return {"error": output}
    print(f"Runtime:", stdout["runtime"])
    print("-" * 50)

    return {
        "cpu_percent": cpu_percent,
        "memory_usage": memory_usage,
        "runtime": stdout["runtime"],
    }

    # solutions = optimize_function(
    #     request.function_code, request.language, request.models, stream=True
    # )

    # for model, value in solutions.items():
    #     # Validate and extract the optimized function
    #     if not validate_fn(value["code"], request.language):
    #         print(f"Invalid optimized function for {model}")
    #         continue

    #     fn = extract_fn(value["code"], request.language)

    #     # Run the optimized function
    #     result = runner.run(fn['script'], request.test_cases)
    #     cpu_percent = result.get("cpu_percent", 0)
    #     memory_usage = result.get("memory_usage", 0)
    #     output = result.get("stdout", "")
    #     print(f"\nCPU Percent: {cpu_percent}, Memory Usage: {memory_usage}")
    #     print(f"\nOutput:", output)
    #     print("-" * 50)
