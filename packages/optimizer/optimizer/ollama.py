import os
import json
import requests
from dotenv import load_dotenv
from .prompts.baseline import get_baseline_payload
from .prompts.exploration import get_exploration_payload

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
        """baselineialize the optimizer with the Ollama API URL."""
        self.signature = signature
        self.language = language
        self.models = models
        self.test_code = test_code
        self.ollama_url = ollama_url or os.getenv("OLLAMA_URL", "")

        if not self.ollama_url:
            raise ValueError("OLLAMA_URL environment variable is not set.")

    def baseline(self):
        """Create an baseline function for optimization given the function signature/description"""
        payload, prompt = get_baseline_payload(
            self.models[0], self.signature, self.language, self.test_code
        )

        response = json.loads(self._query(payload))
        response["prompt"] = prompt
        return response

    def explore(self, model: str, function: str):
        """Create an exploration function for optimization given the function signature/description"""
        payload, prompt = get_exploration_payload(
            model, function, self.language, self.test_code
        )

        response = json.loads(self._query(payload))
        response["prompt"] = prompt
        return response

    def _query(self, payload: dict):
        """Calls the Ollama API synchronously and returns the response as a string."""
        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=60)
            response.raise_for_status()
            return response.json().get("response", "").strip()
        except requests.RequestException as e:
            print(f"Ollama API error: {e}")
            return ""  # Return empty string to indicate failure
