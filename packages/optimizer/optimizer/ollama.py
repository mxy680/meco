import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Access environment variables
OLLAMA_URL = os.getenv("OLLAMA_URL", "")


class OllamaOptimizer:
    def __init__(
        self,
        signature: str,
        language: str,
        models: list[str],
        test_code: str,
        ollama_url: str = None,
    ):
        """Initialize the optimizer with the Ollama API URL."""
        self.signature = signature
        self.language = language
        self.models = models
        self.test_code = test_code
        self.ollama_url = ollama_url or os.getenv("OLLAMA_URL", "")

        if not self.ollama_url:
            raise ValueError("OLLAMA_URL environment variable is not set.")

    def base(self, stream: bool = False):
        """Create a base function for optimization given the function signature/description"""
        prompt: str = self._get_base_prompt(
            self.signature, self.language, self.test_code
        )
        response: str = ""
        model: str = self.models[0]
        payload: dict = self._get_base_payload(model, prompt)
        if stream:
            for text_chunk in self._query_ollama_stream(payload):
                print(text_chunk, end="", flush=True)
                response += text_chunk
        else:
            response = self._query_ollama(payload)

        response = json.loads(response)
        response["prompt"] = prompt
        return response

    def _query_ollama(self, payload: dict):
        """Calls the Ollama API synchronously and returns the response as a string."""
        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=60)
            response.raise_for_status()
            return response.json().get("response", "").strip()
        except requests.RequestException as e:
            print(f"Ollama API error: {e}")
            return ""  # Return empty string to indicate failure

    def _query_ollama_stream(self, payload: dict):
        """Calls the Ollama API with streaming and yields response chunks."""
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

    def _get_base_prompt(self, code: str, language: str, test_code: str):
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
    {code}
    
    Test cases the function must pass:
    {test_code}
        """

    def _get_base_payload(
        self, model: str, prompt: str, stream: bool = False, gen: int = 0
    ):
        payload = {"model": model, "prompt": prompt, "stream": stream}
        payload["format"] = {
            "type": "object",
            "properties": {
                "function": {"type": "string"},
                "description": {"type": "string"},
            },
            "required": ["function", "description"],
        }

        return payload
