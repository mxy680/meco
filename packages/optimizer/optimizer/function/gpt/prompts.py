def get_baseline_prompt(signature: str, test_code: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Implement the function described by the signature so it passes all test cases.\n\n"
                "Execution: Your function will run in a Docker container using `poetry run python script.py`. Install any third-party libraries via Poetry.\n\n"
                "Instructions: Ensure correctness, handle edge cases, and write efficient, readable code. Do not include extra comments.\n\n"
                "Third-Party Libraries: If used, return a valid install command in the format: `poetry add <library-name>`. Native libraries should not be included.\n\n"
                "Output: Return a JSON object with keys: terminal_command, function_implementation, and description.\n\n"
                "Example:\n"
                "```json\n"
                "{\n"
                '  "command": "poetry add examplelib",\n'
                '  "function_implementation": "def process_data(data: list) -> list: import examplelib; return examplelib.process(data)",\n'
                '  "description": "Processes a list using examplelib."\n'
                "}\n"
                "```"
            ),
        },
        {
            "role": "user",
            "content": (
                f"Function Signature:\n{signature}\n\n"
                f"Test Cases (must pass all):\n{test_code}"
            ),
        },
    ]


def get_fix_prompt(function_code: str, error_message: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Your task is to analyze the provided function and the associated error, then fix the function so that it no longer produces the error. "
                "Ensure that your corrected version is efficient, handles edge cases, and follows best coding practices. Do not include extra comments in the function."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Function:\n{function_code}\n\n"
                f"Error:\n{error_message}\n\n"
                "Please provide the corrected version of the function that resolves the error."
            ),
        },
    ]
