import os
import json
import requests
from dotenv import load_dotenv
from .prompts.baseline import get_baseline_payload
from .prompts.exploration import get_exploration_payload
from .prompts.fix import get_fix_payload

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
        test_cases: list[dict],
        test_code: str,
        ollama_url: str = None,
    ):
        """baselineialize the optimizer with the Ollama API URL."""
        self.signature = signature
        self.language = language
        self.models = models
        self.test_cases = test_cases
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

    def persist(self, function: str, validate, runner):
        while isinstance(validate(function, self.language), Exception):
            print("\n❌ Baseline function validation failed. Fixing function...")
            response = self.fix(
                self.models[0],
                function,
                validate(function, self.language).message,
            )
            function = response["optimized_function"]
            print("\n✅ Fixed Baseline Function:\n", function)
            print("\n🔄 Changes Applied:\n", response["changes"])
        else:
            print("\n✅ Baseline Function Validation Passed.")

        result = runner.run(function, self.test_code)
        output = result.get("stdout", "")

        while isinstance(output, str):
            print("\n❌ Function execution error. Attempting to fix...")
            response = self.fix(
                self.models[0],
                function,
                "Execution error in the function implementation: " + output,
            )
            function = response["optimized_function"]
            print("\n✅ Fixed Execution Error:\n", function)
            print("\n🔄 Changes Applied:\n", response["changes"])

            result = runner.run(function, self.test_code)
            output = result.get("stdout", "")
        else:
            print("\n✅ Baseline Function Execution Passed.")

        if isinstance(runner.verify_tests(self.test_cases, output), str):
            print("\n❌ Function failed test cases. Attempting to fix...")
            response = self.fix(
                self.models[0],
                function,
                "Tests failed for the function implementation:\n"
                + runner.verify_tests(self.test_cases, output),
            )
            function = response["optimized_function"]
            print("\n✅ Fixed Failing Tests:\n", function)
            print("\n🔄 Changes Applied:\n", response["changes"])

            result = runner.run(function, self.test_code)
            output = result.get("stdout", "")
        else:
            print("\n✅ Baseline Function Passed All Test Cases.")

        return result

    def explore(self, model: str, function: str):
        """Create an exploration function for optimization given the function signature/description"""
        payload, prompt = get_exploration_payload(
            model, function, self.language, self.test_code
        )

        response = json.loads(self._query(payload))
        response["prompt"] = prompt
        return response

    def fix(self, model: str, function: str, error: str):
        """Create a fix function for optimization given the function signature/description"""
        payload, prompt = get_fix_payload(
            model, function, self.language, self.test_code, error
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
