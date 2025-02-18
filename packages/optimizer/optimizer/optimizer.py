from optimizer.query.ollama import query_ollama, query_ollama_stream
from optimizer.prompts import get_prompt
from optimizer.parser import parse


def optimize_function(
    function_code: str,
    language: str,
    models: list[str],
    generations: int = 0,
    stream: bool = False,
) -> dict:
    """
    Runs evolutionary optimization on a function using multiple LLMs.
    """
    solutions = {}

    for model in models:
        prompt = get_prompt(function_code, language, generations)
        solutions[model] = {"prompt": prompt}

        response = ""
        if stream:
            for text_chunk in query_ollama_stream(prompt, model=model):
                print(text_chunk, end="", flush=True)
                response += text_chunk
        else:
            response = query_ollama(prompt, model=model)

        solutions[model]["code"] = parse(response)
        solutions[model]["full_response"] = response

    return solutions
