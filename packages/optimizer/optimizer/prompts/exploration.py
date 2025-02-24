def get_exploration_prompt(function: str, language: str, test_code: str):
    return f"""
You are given the {language} function and a set of test cases.

Your goal is to optimize the function using unconventional approaches that would be considered "novel" code. 
Optimization is not limited to improving the time complexity of the function, but also other metrics such as memory usage and cpu usage.
If you think it's already optimized, assume its not and you must write some code that you have never seen before and no one has ever thought of.
My goal for you is to discover new algorithms and programming techniques that are more efficient than the existing ones.
Value the metrics of the function more than the code readability and whether it passes the test cases.

Follow these rules:

- Do NOT use any non-native libraries or modules. Remember to import any necessary modules inside the function, not outside.
- Your response must ONLY contain:
1. The optimized function. 
- Do NOT include the original function or any other code. 
- Your function must be named exactly as the original function.
- Do not convert the function into a ternary operator.
- Make sure your optimized function is different from the original function.
2. A brief description of the changes you made.
- Ensure that the function handles edge cases and passes all provided test cases.

Function signature:
{function}

Test cases the function must pass:
{test_code}
        """


def get_exploration_payload(model: str, signature: str, language: str, test_code: str):
    prompt = get_exploration_prompt(signature, language, test_code)
    payload = {"model": model, "prompt": prompt, "stream": False}
    payload["format"] = {
        "type": "object",
        "properties": {
            "optimized_function": {"type": "string"},
            "changes": {"type": "string"},
        },
        "required": ["optimized_function", "changes"],
    }

    return payload, prompt
