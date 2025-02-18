import os
from dotenv import load_dotenv
import requests
import json

# Load environment variables
load_dotenv()

# Access environment variables
OLLAMA_URL = os.getenv("OLLAMA_URL", "")


def query_ollama(prompt: str, model: str):
    """Calls the Ollama API synchronously and returns the response as a string."""
    payload = {"model": model, "prompt": prompt, "stream": False}
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except requests.RequestException as e:
        print(f"Ollama API error: {e}")
        return ""  # Return empty string to indicate failure


def query_ollama_stream(prompt: str, model: str):
    """Calls the Ollama API with streaming and yields response chunks."""
    payload = {"model": model, "prompt": prompt, "stream": True}
    try:
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
