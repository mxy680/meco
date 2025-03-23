import hashlib

def generate_args_hash(test_case: dict) -> str:
    args = ", ".join([f"{k}={v}" for k, v in test_case["inputs"].items()])
    args_hash = hashlib.md5(args.encode()).hexdigest()
    return args, args_hash