def get_fix_prompt(function: str, language: str, test_code: str, error: str):
    return f"""
You are given the {language} function and a set of test cases.
Please fix the function so that it passes all the test cases and has no errors.

Function:
{function}

Test cases the function must pass:
{test_code}

Error:  
{error}
    """


def get_fix_payload(model: str, signature: str, language: str, test_code: str, error: str):
    prompt = get_fix_prompt(signature, language, test_code, error)
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
