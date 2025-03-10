import os
import json
import requests
from dotenv import load_dotenv
from ..client import FunctionOptimizer
from .prompts import get_baseline_prompt

# Load environment variables
load_dotenv()

# Access environment variables
OLLAMA_URL = os.getenv("OLLAMA_URL", "")


class OllamaPythonOptimizer(FunctionOptimizer):
    def __init__(
        self,
        signature: str,
        language: str,
        model: str,
        test_code: str,
        ollama_url: str = None,
    ):
        """Initialize the optimizer with the Ollama API URL."""
        super().__init__(signature, language, test_code, model, get_baseline_prompt)
        self.ollama_url = ollama_url or os.getenv("OLLAMA_URL", "")

        if not self.ollama_url:
            raise ValueError("OLLAMA_URL environment variable is not set.")

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

    @staticmethod
    def get_payload(prompt: str, model: str) -> dict:
        payload = {"model": model, "prompt": prompt, "stream": False}
        payload["format"] = {
            "type": "object",
            "properties": {
                "terminal_command": {"type": "string"},
                "function_implementation": {"type": "string"},
                "description": {"type": "string"},
            },
            "required": ["terminal_command", "function_implementation", "description"],
        }

        return payload
