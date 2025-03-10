from abc import ABC, abstractmethod
import json


class FunctionOptimizer(ABC):
    def __init__(
        self,
        signature: str,
        language: str,
        model: str,
        test_code: str,
        get_baseline_prompt: callable,
    ):
        self.signature = signature
        self.language = language
        self.model = model
        self.test_code = test_code
        self.get_baseline_prompt = get_baseline_prompt

    def baseline(self) -> dict:
        """Create an baseline function for optimization given the function signature/description"""
        prompt = self.get_baseline_prompt(self.signature, self.test_code)
        payload = self.get_payload(prompt, self.model)
        return self._query(payload)

    @abstractmethod
    def _query(self, payload: dict) -> dict:
        pass

    @staticmethod
    @abstractmethod
    def get_payload(*args, **kwargs) -> dict:
        pass
