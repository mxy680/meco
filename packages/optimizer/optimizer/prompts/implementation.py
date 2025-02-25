def get_implementation_prompt(
    function: str, description: str, language: str, test_code: str
):
    return f"""
You are a software engineer implementing a new {language} function.
You are given the a {language} function and description of what you need to optimize.

Follow these rules:
- You CANNOT use non-native libraries such as numpy. Only native libraries are allowed, such as math.
- You cannot use another language.
- Your response must ONLY contain the implementation of the function.
- The function implementation must have the same name as the original function.
- Only include one function in your response.

Function function:
{function}

Optimization Description: 
{description}

Test cases the function must pass:
{test_code}

**AGAIN, DO NOT USE ANY NON-NATIVE LIBRARIES SUCH AS NUMPY**
"""


def get_implementation_payload(
    model: str, function: str, description, language: str, test_code: str
):
    prompt = get_implementation_prompt(function, description, language, test_code)
    payload = {"model": model, "prompt": prompt, "stream": False}
    payload["format"] = {
        "type": "object",
        "properties": {"implementation": {"type": "string"}},
        "required": ["name", "implementation"],
    }

    return payload, prompt
