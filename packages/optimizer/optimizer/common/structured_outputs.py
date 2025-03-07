from pydantic import BaseModel


class FunctionOutput(BaseModel):
    terminal_command: str
    function_implementation: str
    description: str
