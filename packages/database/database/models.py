from pydantic import BaseModel, Field
from typing import Any, Dict, List


class FunctionTestCase(BaseModel):
    inputs: Dict[str, Any]  # Function arguments
    input_types: Dict[str, str]  # Function argument types
    expected_output: Any  # Expected function return value
    expected_output_type: str  # Expected output type (e.g., "int", "float", "list")


class OptimizationRequest(BaseModel):
    signature: str  # Function signature
    language: str  # Programming language
    description: str  # Function description
    models: List[str]  # LLM models to use
    test_cases: List[FunctionTestCase]  # List of structured test cases


class JobRequest(BaseModel):
    job_id: int
    payload: Dict[str, Any]
    job_type: str