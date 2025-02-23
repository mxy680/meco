def get_exploration_prompt(function: str, language: str, test_code: str):
    return f"""
You are given the {language} function and a set of test cases.

Your goal is to implement the function in a way that guarantees it passes all test cases. 
Follow these rules:

- Do NOT use any non-native libraries or modules.
- Your response must ONLY contain:
1. The optimized function. 
- Do NOT include the original function or any other code. 
- Your function must be named exactly as the original function.
- Do not convert the function into a ternary operator.
- Use very unconventional approaches that would be considered "novel" code.
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
