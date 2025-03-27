def get_baseline_prompt(signature: str, description: str, test_code: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Your task is to implement the function so that it passes all provided test cases.\n\n"
                "Use a straightforward, naive approach to solve the problem. While your solution should be correct and handle all edge cases, "
                "it should follow the simplest, most direct method rather than advanced optimizations. Assume that all inputs will be valid and "
                "the function will never need to return value errors.\n\n"
                "Description: " + description + "\n\n"
                "Execution: Your solution will be injected into a script running in a Docker container via `poetry run python script.py`. "
                "Install only third-party libraries using Poetry (e.g., `poetry add <library-name>`) and do not include any native libraries.\n\n"
                "Instructions: Write correct, simple, and readable code that handles all edge cases using this naive approach. Do not include any comments "
                "or write code outside the function. The function signature must match exactly as provided. You may use nested functions if necessary.\n\n"
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
                f"unique and creative theoretical approaches for improving the provided base function. "
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
                "Assume all inputs are valid and focus on reducing runtime, memory usage, and CPU usage while handling edge cases and adhering to best coding practices. "
                "The solution must be efficient, correct, and significantly different from the base function, strictly following the provided approach description. "
                "Execution: The function will be injected into a script running in a Docker container using `poetry run python script.py`. Only install third-party libraries via Poetry "
                "using the format `poetry add <library-name>`, and do not include any native libraries.\n\n"
                "Instructions: Write clean, efficient, and readable code without any comments, and do not include any code outside the function. Nested functions are permitted if needed. "
                "Ensure that the function signature exactly matches the provided one. If a third-party library is absolutely necessary, return a valid install command in the format "
                "`poetry add <library-name>`; otherwise, return an empty string."
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


def get_input_generation_prompt(
    naive_solution: str, description: str, n: int
) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert Python programmer. Your task is to implement a function that, given a naive solution and its description, "
                "generates a scalable input generator function. This generated function should produce exactly n test inputs, where n can be in the "
                "thousands or even millions. The inputs must be diverse and valid for the given function, and the implementation should be efficient "
                "in terms of runtime, memory usage, and CPU usage. Use a generator or another memory-efficient approach to handle large values of n. "
                "Do not include any comments or code outside of the function, and ensure the function signature matches exactly as provided."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Naive Solution:\n{naive_solution}\n\n"
                f"Function Description:\n{description}\n\n"
                f"Number of Inputs (n): {n}"
            ),
        },
    ]
