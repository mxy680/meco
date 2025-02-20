from pydantic import BaseModel, Field
from typing import Any, Dict, List

class FunctionTestCase(BaseModel):
    inputs: Dict[str, Any]  # Function arguments
    expected_output: Any  # Expected function return value
    expected_type: str  # Expected output type (e.g., "int", "float", "list")

class OptimizationRequest(BaseModel):
    function_code: str  # Python function as a string
    models: List[str]  # LLM models to use
    test_cases: List[FunctionTestCase]  # List of structured test cases
