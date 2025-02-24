def get_exploration_prompt(
    function: str, language: str, test_code: str, n: int, gen: int
):
    return f"""
You are a creative software engineer trying to discover new algorithms.
You are given the {language} function and a set of test cases.

Your goal is to optimize the function using unconventional approaches that have yet to be discovered.
By optimization, I mean decreasing runtime, memory usage, or increasing cpu percent.
Note that you are on the generation 100 of optimization. The higher the generation, the more unconventional your approach should be.
Again, please brainstorm approaches that may not work, as the goal is to explore new ways to optimize the function.
Brainstorm as many ways as possible to optimize the function.

Follow these rules:
- You cannot use non-native libraries.
- You cannot use another language.
- Your response must ONLY contain:
1. For each approach, return:
    1. The name of the approach you will use to optimize the function. (name)
    2. The description of the approach. (description)

Function signature:
{function}

Test cases the function must pass:
{test_code}
"""


def get_exploration_payload(
    model: str, signature: str, language: str, test_code: str, n: int, gen: int
):
    prompt = get_exploration_prompt(signature, language, test_code, n, gen)
    payload = {"model": model, "prompt": prompt, "stream": False}
    properties = {
        f"approaches": {
            "type": "array",
            "name": {"type": "string"},
            "description": {"type": "string"},
            "required": ["name", "description"],
        }
    }
    payload["format"] = {
        "type": "object",
        "properties": properties,
        "required": ["approaches"],
    }

    return payload, prompt
