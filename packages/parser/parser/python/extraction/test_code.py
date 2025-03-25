import hashlib

def extract_test_code(fn: dict, test_cases: list[dict]) -> str:
    """
    Converts and validates test cases for a given function.

    Args:
        fn (dict): Function metadata (e.g., name, parameters).
        test_cases (List[Dict]): List of test cases with inputs, expected_output, expected_type.

    Returns:
        str: The generated test code as a string.
    """
    aggregated_cases = ["# Test cases"]

    for case in test_cases:
        args_list = []
        for k, v in case["inputs"].items():
            # If the value is a string, use repr() to include quotes.
            if isinstance(v, str):
                args_list.append(f"{k}={repr(v)}")
            else:
                args_list.append(f"{k}={v}")
        args = ", ".join(args_list)
        args_hash = hashlib.md5(args.encode()).hexdigest()
        statement = f"            results['{args_hash}'] = {fn['name']}({args})"
        aggregated_cases.append(statement)

    test_code = "\n".join(aggregated_cases)
    return test_code
