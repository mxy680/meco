def get_baseline_prompt(signature: str, description: str, test_code: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Implement the function so it passes all test cases.\n\n"
                "Description: " + description + "\n\n"
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


def get_approach_prompt(
    base_function: str, problem_description: str, n: int
) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an innovative problem solver. Your task is to generate "
                f"{n} theoretical approaches for improving the provided base function "
                "Approaches may use native or third-party libraries if needed."
                "Each approach should be presented as a JSON object containing only a single key: 'description'. "
                "Do not include any code, or additional fields or commentary."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Base Function:\n{base_function}\n\n"
                f"Problem Description:\n{problem_description}\n\n"
                f"Please provide {n} theoretical approaches, each as a JSON object with only a 'description' field. "
                "Ensure that your approach can be implemented in a Python script"
            ),
        },
    ]
