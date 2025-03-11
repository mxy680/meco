def get_baseline_prompt(signature: str, description: str, test_code: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Implement the function so it passes all test cases.\n\n"
                "Description: " + description + "\n\n"
                "Execution: Your function will be injected into a script in a Docker container and ran using `poetry run python script.py`. Install any third-party libraries via Poetry.\n\n"
                "Instructions: Ensure correctness, handle edge cases, and write efficient, readable code. DO NOT INCLUDE ANY COMMENTS. Do not write code outside of the functions. If necessary, you may use nested functions.\n\n"
                "Third-Party Libraries: If absolutely necessary, you may use a third party library, and if used, return a valid install command in the format: `poetry add <library-name>`. Native libraries should not be included.\n\n"
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


def get_solution_prompt(function: str, approach: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Your task is to implement the given approach as a Python function that improves upon the provided base function. "
                "Ensure that the solution is efficient, handles edge cases, and adheres to best coding practices. "
                "Execution: Your function will be injected into a script in a Docker container and ran using `poetry run python script.py`. Install any third-party libraries via Poetry.\n\n"
                "Instructions: Ensure correctness, handle edge cases, and write efficient, readable code. DO NOT INCLUDE ANY COMMENTS. Do not write code outside of the functions. If necessary, you may use nested functions.\n\n"
                "Third-Party Libraries: If absolutely necessary, you may use a third party library, and if used, return a valid install command in the format: `poetry add <library-name>`. Native libraries should not be included. If no third-party libraries are used, return an empty string.\n\n"
            ),
        },
        {
            "role": "user",
            "content": (
                f"Base Function:\n{function}\n\n"
                f"Approach Description:\n{approach}\n\n"
            ),
        },
    ]
