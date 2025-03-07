import os
import json
import requests
from dotenv import load_dotenv
from .prompts.baseline import get_baseline_payload

# Load environment variables
load_dotenv()

# Access environment variables
OLLAMA_URL = os.getenv("OLLAMA_URL", "")


class OllamaPythonOptimizer:
    def __init__(
        self,
        signature: str,
        models: list[str],
        test_cases: list[dict],
        test_code: str,
        ollama_url: str = None,
    ):
        """Initialize the optimizer with the Ollama API URL."""
        self.signature = signature
        self.language = "python"
        self.models = models
        self.test_cases = test_cases
        self.test_code = test_code
        self.ollama_url = ollama_url or os.getenv("OLLAMA_URL", "")

        if not self.ollama_url:
            raise ValueError("OLLAMA_URL environment variable is not set.")

    def baseline(self):
        """Create an baseline function for optimization given the function signature/description"""
        payload = get_baseline_payload(self.models[0], self.signature, self.test_code)
        response = self._query(payload)
        return response

    def _query(self, payload: dict):
        """Calls the Ollama API synchronously and returns the response as a string."""
        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=60)
            response.raise_for_status()
            str_response = response.json().get("response", "").strip()
            return json.loads(str_response)
        except requests.RequestException as e:
            if isinstance(e, requests.ConnectionError):
                print(
                    "Ollama API connection error: Please check the Ollama URL and Models."
                )
            else:
                print(f"Ollama API error: {e}")
            return {}  # Return empty dict to indicate failure
