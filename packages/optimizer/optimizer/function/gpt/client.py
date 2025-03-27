import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from optimizer.redis.client import RedisClient
from optimizer.prompts.function.get_prompt import get_prompt
from .models import FunctionOutput, ApproachOutput, InputGenerationOutput
from pydantic import BaseModel
from parser.utils import generate_args_hash


# Load environment variables
load_dotenv()

# Access environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class OpenAIOptimizer:
    def __init__(
        self,
        signature: str,
        description: str,
        language: str,
        model: str,
        test_code: str,
    ):
        """Initialize the OpenAI Optimizer with the function signature, models, test cases, and test code."""
        if not OPENAI_API_KEY:
            raise ValueError(
                "Please set the OPENAI_API_KEY environment variable to use the OpenAI API."
            )
        self.openai = OpenAI(api_key=OPENAI_API_KEY)
        self.redis = RedisClient("localhost", 6379, 0)

        self.signature = signature
        self.description = description
        self.language = language
        self.model = model
        self.test_code = test_code
        self.prev_approaches = []

    def baseline(self) -> dict:
        """Create an baseline function for optimization given the function signature/description"""
        system_prompt, user_prompt = get_prompt(
            self.language,
            "baseline",
            signature=self.signature,
            description=self.description,
            test_code=self.test_code,
        )
        prompt = self.construct_prompt(system_prompt, user_prompt)
        payload = self.get_payload(prompt, self.model, FunctionOutput)
        return self.query(payload)

    def fix(self, function: str, error: str) -> dict:
        system_prompt, user_prompt = get_prompt(
            self.language, "fix", function=function, error=error
        )
        prompt = self.construct_prompt(system_prompt, user_prompt)
        payload = self.get_payload(prompt, self.model, FunctionOutput)
        return self.query(payload)

    def approach(
        self,
        function: str,
        n: int = 3,
    ) -> dict:
        system_prompt, user_prompt = get_prompt(
            self.language,
            "approach",
            n=n,
            base_function=function,
            problem_description=self.description,
            prev_approaches=self.prev_approaches,
        )
        prompt = self.construct_prompt(system_prompt, user_prompt)
        payload = self.get_payload(prompt, self.model, ApproachOutput)
        return self.query(payload)

    def solution(self, function: str, approach: str) -> dict:
        system_prompt, user_prompt = get_prompt(
            self.language, "solution", function=function, approach=approach
        )
        prompt = self.construct_prompt(system_prompt, user_prompt)
        payload = self.get_payload(prompt, self.model, FunctionOutput)
        approach = self.query(payload)
        self.prev_approaches.append(approach)
        return approach

    def generate_inputs(self, naive_solution: str) -> dict:
        system_prompt, user_prompt = get_prompt(
            self.language,
            "input_generation",
            naive_solution=naive_solution,
            description=self.description,
        )
        prompt = self.construct_prompt(system_prompt, user_prompt)
        payload = self.get_payload(prompt, self.model, InputGenerationOutput)
        return self.query(payload)

    def query(self, payload: dict) -> dict:
        """Query the OpenAI API with the given payload."""
        key = self.redis.generate_cache_key(payload["model"], payload["messages"])

        # Check if response is cached in Redis
        cached_response = self.redis.get(key)
        if cached_response:
            # Decode the cached JSON string and return a dict
            response = json.loads(json.loads(cached_response.decode("utf-8")))
            return response

        completion = self.openai.beta.chat.completions.parse(
            model=payload["model"],
            messages=payload["messages"],
            response_format=payload["response_format"],
        )

        output = json.dumps(completion.choices[0].message.parsed.model_dump_json())

        # Cache the response in Redis
        self.redis.set(key, output)

        # Return the dictionary directly
        return json.loads(json.loads(output))

    @staticmethod
    def get_payload(
        messages: list[dict], model: str, response_format: BaseModel
    ) -> dict:
        return {
            "model": model,
            "messages": messages,
            "response_format": response_format,
        }

    @staticmethod
    def construct_prompt(system_prompt: str, user_prompt: str) -> list[dict]:
        return [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ]

    @staticmethod
    def verify(test_cases: list[dict], output: dict) -> tuple[bool, str]:
        for case in test_cases:
            _, args_hash = generate_args_hash(case)
            if args_hash not in output:
                return (
                    False,
                    "Test case not found in output: " + json.dumps(case["inputs"]),
                )
            if output[args_hash] != case["expected_output"]:
                return (
                    False,
                    "Test case failed: "
                    + json.dumps(case["inputs"])
                    + " -> "
                    + json.dumps(case["expected_output"]),
                )
        return (True, "All test cases passed.")
