import hashlib

def generate_args_hash(test_case: dict) -> str:
    for (k, v), (k2, v2) in zip(test_case["inputs"].items(), test_case["input_types"].items()):
       print(k, v, k2, v2)
    args = ", ".join([f"{k}={v}" for k, v in test_case["inputs"].items()])
    args_hash = hashlib.md5(args.encode()).hexdigest()
    return args, args_hash