def get_baseline_prompt(signature: str, description: str, test_code: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Your task is to implement the function so that it passes all provided test cases.\n\n"
                "Use the most typical approach to solve the problem. Ensure your solution is correct, efficient, and handles all edge cases. "
                "Description: " + description + "\n\n"
                "Execution: Your solution will be injected into a script running in a Docker container via `poetry run python script.py`. "
                "Install only third-party libraries using Poetry (e.g., `poetry add <library-name>`) and do not include any native libraries.\n\n"
                "Instructions: Write correct, efficient, and readable code that handles all edge cases. Do not include any comments or write code outside the function. "
                "The function signature must match exactly as provided. You may use nested functions if necessary.\n\n"
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
                "You are an expert Python programmer. The previously generated solution resulted in an error during execution or a terminal command error. "
                "Analyze the provided function and error message, then fix the code so that the error is resolved. "
                "Ensure your corrected version is efficient, handles edge cases, and follows best coding practices. "
                "You should be using the same approach as the original solution, but you may need to make modifications to the code. "
                "Do not include comments in the function and only return terminal commands as an empty string or in the format 'poetry add <package-name>'."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Function:\n{function_code}\n\n" f"Error:\n{error_message}\n\n"
            ),
        },
    ]


def get_approach_prompt(
    base_function: str, problem_description: str, prev_approaches: list[str], n: int
) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an innovative problem solver. Your task is to generate "
                f"{n} unique and creative theoretical approaches for improving the provided base function. "
                "Each approach must be presented as a single dense sentence in a JSON object containing only the key 'description'. "
                "Do not include any code, additional fields, or commentary. "
                "Ensure that your new approaches are distinct from the base function's approach and do not repeat any of the previously suggested approaches; you may only build on or refine them. "
                "Feel free to use public libraries, but you cannot use APIs or external services."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Base Function:\n{base_function}\n\n"
                f"Problem Description:\n{problem_description}\n\n"
                f"Previous Approaches:\n{prev_approaches}\n\n"
                f"Please provide {n} unconventional approaches, each as a JSON object with only a 'description' field and described in one dense sentence."
            ),
        },
    ]


def get_solution_prompt(function: str, approach: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Your task is to implement the described approach as a Python function that enhances the provided base function. "
                "The solution must be efficient, handle edge cases, and adhere to best coding practices. "
                "The solution must be different from the base function, and must adhere to the provided approach description. "
                "Execution: The function will be injected into a script running in a Docker container using `poetry run python script.py`. Install only third-party libraries via Poetry (using the format `poetry add <library-name>`) and do not include any native libraries.\n\n"
                "Instructions: Write correct, efficient, and readable code without any comments. Do not include code outside of the function. Nested functions are permitted if needed. Ensure that the function signature exactly matches the provided one.\n\n"
                "Third-Party Libraries: Only use a third-party library if absolutely necessary. If used, return a valid install command in the format `poetry add <library-name>`; otherwise, return an empty string."
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
