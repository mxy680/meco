def aggregate_test_cases(fn: dict, test_cases):
    args = fn["params"].split(", ")

    test_code = []
    for case in test_cases:
        if len(case.keys()) > 1:
            raise ValueError("Only single argument test cases are supported.")

        arg = list(case.keys())[0]
        if arg not in args:
            raise ValueError(f"Argument {arg} not found in function parameters: {args}")

        value = case[arg]
        test_code.append(f"        results['{case[arg]}'] = {fn['name']}({value})")
    return "\n".join(test_code)
