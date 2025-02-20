import pytest
import sys
import os
import json

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, base_path)

from app.controllers.optimization import optimize_function
from app.models import OptimizationRequest, FunctionTestCase


@pytest.mark.asyncio
async def test_function_fibonacci():
    function_code = """def fibonacci(n):
    if n <= 1:
        return n

    fib_list = [0, 1]
    for i in range(2, n + 1):
        fib_list.append(fib_list[i - 1] + fib_list[i - 2])
    return fib_list[-1]
"""
    models = ["codellama"]
    test_cases = [
        FunctionTestCase(inputs={"n": 0}, expected_output=0, expected_type="int"),
        FunctionTestCase(inputs={"n": 1}, expected_output=1, expected_type="int"),
        FunctionTestCase(inputs={"n": 2}, expected_output=1, expected_type="int"),
        FunctionTestCase(inputs={"n": 3}, expected_output=2, expected_type="int"),
        FunctionTestCase(inputs={"n": 4}, expected_output=3, expected_type="int"),
        FunctionTestCase(inputs={"n": 5}, expected_output=5, expected_type="int"),
        FunctionTestCase(inputs={"n": 6}, expected_output=8, expected_type="int"),
        FunctionTestCase(inputs={"n": 7}, expected_output=13, expected_type="int"),
        FunctionTestCase(inputs={"n": 8}, expected_output=21, expected_type="int"),
    ]

    request = OptimizationRequest(
        function_code=function_code,
        models=models,
        test_cases=test_cases,
    )
    result = await optimize_function(request, "python")
    print(result)


@pytest.mark.asyncio
async def test_function_gcd_unoptimal():
    function_code = """def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
"""
    models = ["codellama"]
    test_cases = [
        FunctionTestCase(
            inputs={"a": 48, "b": 18}, expected_output=6, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 101, "b": 103}, expected_output=1, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 56, "b": 98}, expected_output=14, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 270, "b": 192}, expected_output=6, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 10, "b": 0}, expected_output=10, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 0, "b": 10}, expected_output=10, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 7, "b": 13}, expected_output=1, expected_type="int"
        ),
        FunctionTestCase(
            inputs={"a": 144, "b": 89}, expected_output=1, expected_type="int"
        ),
    ]

    request = OptimizationRequest(
        function_code=function_code,
        models=models,
        test_cases=test_cases,
    )
    result = await optimize_function(request, "python")
    print(result)
