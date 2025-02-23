def get_baseline_prompt(signature: str, language: str, test_code: str):
    return f"""
You are given the {language} function signature and a set of test cases.

Your goal is to implement the function in a way that guarantees it passes all test cases. 
Follow these rules:

- Do NOT use any non-native libraries or modules.
- Your response must ONLY contain:
1. The function implementation.
2. A brief description of what the function does.
- Ensure that the function handles edge cases and passes all provided test cases.

Function signature:
{signature}

Test cases the function must pass:
{test_code}
        """


def get_baseline_payload(model: str, signature: str, language: str, test_code: str):
    prompt = get_baseline_prompt(signature, language, test_code)
    payload = {"model": model, "prompt": prompt, "stream": False}
    payload["format"] = {
        "type": "object",
        "properties": {
            "function_implementation": {"type": "string"},
            "description": {"type": "string"},
        },
        "required": ["function_implementation", "description"],
    }

    return payload, prompt
