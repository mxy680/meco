import json
import hashlib


def generate_cache_key(messages: list) -> str:
    key_str = json.dumps(messages, sort_keys=True)
    return hashlib.sha256(key_str.encode("utf-8")).hexdigest()
