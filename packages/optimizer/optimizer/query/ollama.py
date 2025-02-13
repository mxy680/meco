import os
from dotenv import load_dotenv
import requests
import json

# Load environment variables
load_dotenv()

# Access environment variables
OLLAMA_URL = os.getenv("OLLAMA_URL", "")
MODEL_NAME = os.getenv("MODEL_NAME", "")


def query_ollama(prompt: str, model: str, stream: bool = False):
    """
    Calls the Ollama API to optimize a function with live streaming.
    Yields chunks of the response in real-time.
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": stream,
    }

    try:
        if not stream:
            response = requests.post(OLLAMA_URL, json=payload, timeout=60)
            response.raise_for_status()
            return response.json().get("response", "").strip()
        else:
            with requests.post(
                OLLAMA_URL, json=payload, stream=True, timeout=60
            ) as response:
                response.raise_for_status()
                for chunk in response.iter_lines(decode_unicode=True):
                    if chunk:
                        try:
                            data = json.loads(chunk)
                            yield data.get("response", "")
                        except json.JSONDecodeError:
                            continue  # Skip malformed chunks
    except requests.RequestException as e:
        print(f"Ollama API error: {e}")
        yield ""  # Return empty string to indicate failure
