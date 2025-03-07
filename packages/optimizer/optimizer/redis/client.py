import redis
from .key import generate_cache_key
import json


class RedisClient:
    def __init__(self, host, port, db):
        self.redis = redis.Redis(host=host, port=port, db=db)

    def get(self, key: str) -> str:
        """Load the value from the given key."""
        # Check if response is cached in Redis
        return self.redis.get(key)

    def set(self, key: str, output: dict):
        self.redis.set(key, output)

    def flush(self):
        self.redis.flushdb()

    @staticmethod
    def generate_cache_key(messages: list[str]) -> str:
        """Generate a cache key for the given messages."""
        return generate_cache_key(messages)
