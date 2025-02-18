from fastapi import APIRouter
from app.models import OptimizationRequest
from optimizer.optimizer import optimize_function
from runner.client import Runner
from parser.validate import validate_fn
from parser.extract import extract_fn

router = APIRouter()


@router.post("/optimize")
async def optimize(request: OptimizationRequest):
    # Validate and extract the original function
    if not validate_fn(request.function_code, request.language):
        return {"error": "Invalid function code."}

    # Get the function properties
    fn_props: dict = extract_fn(request.function_code, request.language)
    
    # Run the original function
    runner = Runner(request.language)
    runner.start_container()
    
    result = runner.run(request.function_code, fn_props, request.test_cases)
    cpu_percent = result.get("cpu_percent", 0)
    memory_usage = result.get("memory_usage", 0)
    print(request.function_code)
    print(f"\nCPU Percent: {cpu_percent}, Memory Usage: {memory_usage}")
    print("-" * 50)

    solutions = optimize_function(
        request.function_code, request.language, request.models, stream=True
    )
    
    for model, value in solutions.items():
        # Validate and extract the optimized function
        if not validate_fn(value["code"], request.language):
            print(f"Invalid optimized function for {model}")
            continue
        
        fn_props = extract_fn(value["code"], request.language)
        
        # Run the optimized function
        result = runner.run(value["code"], fn_props, request.test_cases)
        cpu_percent = result.get("cpu_percent", 0)
        memory_usage = result.get("memory_usage", 0)
        output = result.get("stdout", "")
        print(f"\nCPU Percent: {cpu_percent}, Memory Usage: {memory_usage}")
        print("-" * 50)
        