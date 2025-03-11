import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from optimizer.redis.client import RedisClient
from ..client import FunctionOptimizer
from .models import FunctionOutput, ApproachOutput

# Load environment variables
load_dotenv()

# Access environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class OpenAIOptimizer(FunctionOptimizer):
    def __init__(
        self,
        signature: str,
        description: str,
        language: str,
        model: str,
        test_code: str,
    ):
        """Initialize the OpenAI Optimizer with the function signature, models, test cases, and test code."""
        if language == "python":
            from .prompts.python import (
                get_baseline_prompt,
                get_fix_prompt,
                get_approach_prompt,
            )

        super().__init__(
            signature,
            description,
            language,
            model,
            test_code,
            get_baseline_prompt,
            get_fix_prompt,
            get_approach_prompt,
        )

        if not OPENAI_API_KEY:
            raise ValueError(
                "Please set the OPENAI_API_KEY environment variable to use the OpenAI API."
            )
        self.openai = OpenAI(api_key=OPENAI_API_KEY)
        self.redis = RedisClient("localhost", 6379, 0)

    def _query(self, payload: dict) -> dict:
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
    def get_payload(messages: list[dict], model: str, is_code_output: bool) -> dict:
        return {
            "model": model,
            "messages": messages,
            "response_format": FunctionOutput if is_code_output else ApproachOutput,
        }
