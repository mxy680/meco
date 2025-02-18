from pydantic import BaseModel


class OptimizationRequest(BaseModel):
    function_code: str
    language: str
    test_cases: list
    models: list
