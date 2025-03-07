import os
from dotenv import load_dotenv
from .prompts.baseline import get_baseline_payload
from openai import OpenAI
import json
from optimizer.redis.client import RedisClient

# Load environment variables
load_dotenv()

# Access environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class OpenAIOptimizer:
    def __init__(
        self,
        signature: str,
        models: list[str],
        test_cases: list[dict],
        test_code: str,
    ):
        """Initialize the OpenAI Optimizer with the function signature, models, test cases, and test code."""
        if not OPENAI_API_KEY:
            raise ValueError(
                "Please set the OPENAI_API_KEY environment variable to use the OpenAI API."
            )

        self.signature = signature
        self.language = "python"
        self.models = models
        self.test_cases = test_cases
        self.test_code = test_code
        self.openai = OpenAI(api_key=OPENAI_API_KEY)
        self.redis = RedisClient("localhost", 6379, 0)
        self.cache = {}

    def baseline(self):
        """Create an baseline function for optimization given the function signature/description"""
        payload = get_baseline_payload(self.models[0], self.signature, self.test_code)
        response = self._query(payload)
        return response

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
