import hashlib
import json


def generate_args_hash(case: dict) -> str:
    args_list = []
    for k, v in case["inputs"].items():
        # If the value is a string, use json.dumps to ensure double quotes.
        if isinstance(v, str):
            value_str = json.dumps(v).replace('"', "'")
        else:
            value_str = str(v)
        args_list.append(f"{k}={value_str}")
    args = ", ".join(args_list)
    args_hash = hashlib.md5(args.encode()).hexdigest()
    return args, args_hash
