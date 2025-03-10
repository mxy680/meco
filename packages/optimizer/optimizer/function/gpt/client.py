import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from optimizer.redis.client import RedisClient
from ..client import FunctionOptimizer
from ..models import FunctionOutput
from .prompts import get_baseline_prompt

# Load environment variables
load_dotenv()

# Access environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class OpenAIOptimizer(FunctionOptimizer):
    def __init__(
        self, signature: str, language: str, models: list[str], test_code: str
    ):
        """Initialize the OpenAI Optimizer with the function signature, models, test cases, and test code."""
        super().__init__(signature, language, test_code, models, get_baseline_prompt)

        if not OPENAI_API_KEY:
            raise ValueError(
                "Please set the OPENAI_API_KEY environment variable to use the OpenAI API."
            )
        self.openai = OpenAI(api_key=OPENAI_API_KEY)
        self.redis = RedisClient("localhost", 6379, 0)

    def _query(self, payload: dict):
        """Query the OpenAI API with the given payload."""
        key = self.redis.generate_cache_key(payload["messages"])

        # Check if response is cached in Redis
        cached_response = self.redis.get(key)
        if cached_response:
            # Redis stores bytes, so decode it back to a string then parse the JSON
            return json.loads(cached_response.decode("utf-8"))

        completion = self.openai.beta.chat.completions.parse(
            model=payload["model"],
            messages=payload["messages"],
            response_format=payload["response_format"],
        )
        output = json.dumps(completion.choices[0].message.parsed.model_dump_json())

        # Cache the response in Redis (serialize it as JSON)
        self.redis.set(key, output)

        return output

    @staticmethod
    def get_payload(messages: list[dict], model: str) -> dict:
        return {
            "model": model,
            "messages": messages,
            "response_format": FunctionOutput,
        }
