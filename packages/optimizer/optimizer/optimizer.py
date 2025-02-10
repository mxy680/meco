import requests

OLLAMA_URL = "http://your-ec2-ip:11434/api/generate"

def query_ollama(prompt: str) -> str:
    """
    Calls the Ollama API to optimize a function.
    """
    payload = {
        "model": "codellama",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except requests.RequestException as e:
        print(f"Ollama API error: {e}")
        return ""  # Return empty to indicate failure

def optimize_function(function_code: str, language: str, generations: int = 0) -> str:
    """
    Runs evolutionary optimization on a function using Ollama.
    """
    # First Round: Initial Optimization
    first_prompt = f"""
    Optimize the following {language} function for performance while keeping it functionally correct.
    
    ```{language}
    {function_code}
    ```

    Return only the optimized function code.
    """
    best_function = query_ollama(first_prompt)

    # Secondary Evolutions: Further Refinements
    for _ in range(generations):
        evolution_prompt = f"""
        Improve the following {language} function further while maintaining correctness.
        Focus on efficiency and performance optimizations.

        ```{language}
        {best_function}
        ```

        Return only the improved function code.
        """
        evolved_function = query_ollama(evolution_prompt)

        # Ensure Ollama returned something valid
        if evolved_function:
            best_function = evolved_function

    return best_function
