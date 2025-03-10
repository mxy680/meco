from abc import ABC, abstractmethod


class FunctionOptimizer(ABC):
    def __init__(
        self,
        signature: str,
        language: str,
        test_code: str,
        models: list[str],
        get_baseline_prompt: callable,
    ):
        self.signature = signature
        self.language = language
        self.test_code = test_code
        self.models = models
        self.get_baseline_prompt = get_baseline_prompt

    def baseline(self):
        """Create an baseline function for optimization given the function signature/description"""
        prompt = self.get_baseline_prompt(self.signature, self.test_code)
        payload = self.get_payload(prompt, self.models[0])
        response = self._query(payload)
        return response

    @abstractmethod
    def _query(self, payload: dict):
        pass

    @staticmethod
    @abstractmethod
    def get_payload(*args, **kwargs) -> dict:
        pass
