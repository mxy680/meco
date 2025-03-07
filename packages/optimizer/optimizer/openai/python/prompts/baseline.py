from optimizer.common.structured_outputs import FunctionOutput


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


def get_baseline_payload(model: str, signature: str, test_code: str):
    messages = get_baseline_prompt(signature, test_code)
    payload = {"model": model, "messages": messages, "response_format": FunctionOutput}
    return payload
