def get_prompt(
    function: str, language: str, generation: int, same_language: bool = True
) -> str:
    """
    Generates a prompt for optimizing a given function.

    Args:
        function (str): The function code to optimize.
        language (str): The programming language of the function.
        generation (int): The optimization round (initial = 0, further = 1, 2, ...).
        same_language (bool): Whether the optimized function should be in the same language.

    Returns:
        str: A formatted prompt for the LLM.
    """

    base_instruction = f"Optimize the following {language} function for better performance and efficiency in terms of runtime, cpu usage, memory usage, etc. You are not allowed to use any non-native libraries or modules."

    if generation > 0:
        base_instruction = (
            f"Further improve the previously optimized {language} function, "
            f"considering computational efficiency, readability, and maintainability."
        )

    language_instruction = (
        f"Provide the optimized function in {language}."
        if same_language
        else f"Convert this function into the most efficient programming language."
    )

    prompt = f"""{base_instruction}
    
    {language_instruction}

    Function:
    ```
    {function}
    ```

    Return only the optimized function with no explanations.
    DO NOT RETURN ANYTHING BUT CODE!
    """

    return prompt
