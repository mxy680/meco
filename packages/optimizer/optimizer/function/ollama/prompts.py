def get_baseline_prompt(signature: str, test_code: str) -> str:
    return f"""
You are an expert Python programmer. Your task is to implement the function described by the following signature and ensure that it correctly passes all given test cases.

Execution Environment:
- Your function will be injected into a .py file inside a Docker container.
- The script will be executed using poetry run python script.py inside the container.
- If any third-party libraries are required, they must be installed using Poetry before execution.

Instructions:
- Correctness First: The implementation must pass all test cases. Handle edge cases, boundary conditions, and invalid inputs gracefully.
- Efficient & Readable Code: Write code that is both efficient and easy to understand. Avoid unnecessary complexity.
- Do NOT add comments: Your function should be clean and self-explanatory without any inline comments or docstring explanations beyond the required format.

Third-Party Libraries (MANDATORY RULES):
- You may use third-party libraries, but:
  - All required dependencies must be installed before execution.
  - If your function contains an import statement for a third-party library, you must return a valid Poetry install terminal_command.
  - The terminal_command must be in the format terminal_command: poetry add <library-name>.
  - Do not add native Python libraries (e.g., os, sys, math) to the terminal_command.

Output Format:
Your response must be a structured JSON object with the following keys:
1. terminal_command: A string containing the terminal terminal_command to install dependencies via Poetry.
2. function_implementation: A string containing the full function implementation (including the function signature).
3. description: A concise explanation explaining what the function does.

Function Signature:
{signature}

Test Cases (Your implementation must pass all of these):
{test_code}

Correct (Uses examplelib and returns install command)
```json
{{
    "command": "poetry add examplelib",
    "function_implementation": "def process_data(data: list) -> list: import examplelib; return examplelib.process(data)",
    "description": "Processes a list using examplelib."
}}
```
"""
