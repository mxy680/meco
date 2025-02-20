import pytest
import sys
import os
import json

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, base_path)

from app.controllers.optimization import optimize_function
from app.models import OptimizationRequest

# Helper function to log results to a file
def log_results(test_name, results):
    log_file = os.path.join(base_path, "results_log.txt")
    with open(log_file, "a") as f:
        f.write(f"Test: {test_name}\n")
        f.write(json.dumps(results, indent=4))
        f.write("\n\n")


@pytest.mark.asyncio
async def test_function_fibonacci_unoptimal():
    function_code = """def fibonacci(n):
    if n <= 1:
        return n

    fib_list = [0, 1]
    for i in range(2, n + 1):
        fib_list.append(fib_list[i - 1] + fib_list[i - 2])
    return fib_list[-1]
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"n": 0},
        {"n": 1},
        {"n": 5},
        {"n": 55},
        {"n": 610},
    ]

    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_fibonacci_unoptimal", results)


@pytest.mark.asyncio
async def test_function_fibonacci_optimal():
    function_code = """def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"n": 0},
        {"n": 1},
        {"n": 5},
        {"n": 55},
        {"n": 610},
    ]

    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_fibonacci_optimal", results)


@pytest.mark.asyncio
async def test_function_bubble_sort_unoptimal():
    function_code = """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1): 
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"arr": [3, 1, 4, 1, 5]},
        {"arr": [1, 1, 3, 4, 5]},
    ]

    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_bubble_sort_unoptimal", results)


@pytest.mark.asyncio
async def test_function_bubble_sort_optimal():
    function_code = """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"arr": [3, 1, 4, 1, 5]},
        {"arr": [1, 1, 3, 4, 5]},
    ]

    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_bubble_sort_optimal", results)


@pytest.mark.asyncio
async def test_function_prime_check_unoptimal():
    function_code = """def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):  # Too many unnecessary checks
        if n % i == 0:
            return False
    return True
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"n": 10},
        {"n": 17},
    ]

    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_prime_check_unoptimal", results)


@pytest.mark.asyncio
async def test_function_prime_check_optimal():
    function_code = """def is_prime(n):
    if n <= 1:
        return False
    if n in {2, 3}:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    for i in range(5, int(n**0.5) + 1, 2):  # Check odd numbers only
        if n % i == 0:
            return False
    return True
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"n": 10},
        {"n": 17},
    ]

    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_prime_check_optimal", results)


@pytest.mark.asyncio
async def test_function_string_reverse_unoptimal():
    function_code = """def reverse_string(s):
    result = ""
    for char in s:  # Appending to string in loop (slow)
        result = char + result
    return result
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"s": "hello"},
        {"s": "world"},
    ]
    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_string_reverse_unoptimal", results)


@pytest.mark.asyncio
async def test_function_string_reverse_optimal():
    function_code = """def reverse_string(s):
    return s[::-1]
"""
    language = "python"
    models = ["codellama"]
    test_cases = [
        {"s": "hello"},
        {"s": "world"},
    ]
    request = OptimizationRequest(
        function_code=function_code,
        language=language,
        models=models,
        test_cases=test_cases,
    )
    results = await optimize_function(request)
    log_results("test_function_string_reverse_optimal", results)
