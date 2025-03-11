from pydantic import BaseModel
from typing import List


class FunctionOutput(BaseModel):
    terminal_command: str
    function_implementation: str


class TheoreticalApproach(BaseModel):
    description: str


class ApproachOutput(BaseModel):
    approaches: List[TheoreticalApproach]
