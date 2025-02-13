import re


def parse(response: str) -> str:
    """
    Extracts the code snippet from an LLM response.

    Args:
        response (str): The raw response containing the optimized code.

    Returns:
        str: The extracted code snippet without the ``` wrapper and language identifier.
    """
    # Match triple backticks with an optional language identifier
    match = re.search(r"```(?:\w+)?\n([\s\S]+?)\n```", response)

    if match:
        return match.group(1).strip()

    return response.strip()
