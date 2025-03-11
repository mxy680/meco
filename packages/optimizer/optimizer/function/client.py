from abc import ABC, abstractmethod
from typing import Union
from parser.utils import generate_args_hash
import json


class FunctionOptimizer(ABC):
    def __init__(
        self,
        signature: str,
        description: str,
        language: str,
        model: str,
        test_code: str,
        get_baseline_prompt: callable,
        get_fix_prompt: callable,
        get_approach_prompt: callable,
        get_solution_prompt: callable,
    ):
        self.signature = signature
        self.description = description
        self.language = language
        self.model = model
        self.test_code = test_code
        self.get_baseline_prompt = get_baseline_prompt
        self.get_fix_prompt = get_fix_prompt
        self.get_approach_prompt = get_approach_prompt
        self.get_solution_prompt = get_solution_prompt

    def call(self, prompt: str, is_code_output: bool = True) -> dict:
        payload = self.get_payload(prompt, self.model, is_code_output)
        return self._query(payload)

    def baseline(self) -> dict:
        """Create an baseline function for optimization given the function signature/description"""
        prompt = self.get_baseline_prompt(
            self.signature, self.description, self.test_code
        )
        return self.call(prompt)

    def fix(self, function: str, error: str) -> dict:
        prompt = self.get_fix_prompt(function, error)
        return self.call(prompt)

    def approach(self, function: str, n: int = 3) -> dict:
        prompt = self.get_approach_prompt(function, self.description, n)
        return self.call(prompt, is_code_output=False)

    def solution(self, function: str, approach: str) -> dict:
        prompt = self.get_solution_prompt(function, approach)
        return self.call(prompt)

    @staticmethod
    def verify(test_cases: dict, output: dict) -> tuple[bool, str]:
        for case in test_cases:
            _, args_hash = generate_args_hash(case)
            if args_hash not in output:
                return (
                    False,
                    "Test case not found in output: " + json.dumps(case.inputs),
                )
            if output[args_hash] != case.expected_output:
                return (
                    False,
                    "Test case failed: "
                    + json.dumps(case.inputs)
                    + " -> "
                    + json.dumps(case.expected_output),
                )
        return (True, "All test cases passed.")

    @abstractmethod
    def _query(self, payload: dict) -> dict:
        pass

    @staticmethod
    @abstractmethod
    def get_payload(*args, **kwargs) -> dict:
        pass
