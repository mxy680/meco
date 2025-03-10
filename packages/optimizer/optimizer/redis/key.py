import json
import hashlib

def generate_cache_key(model: str, messages: list) -> str:
    filtered_payload = {
        "model": model,
        "messages": messages
    }
    key_str = json.dumps(filtered_payload, sort_keys=True)
    return hashlib.sha256(key_str.encode("utf-8")).hexdigest()
