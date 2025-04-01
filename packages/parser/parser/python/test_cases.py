from parser.utils import generate_args_hash


def validate_test_cases(params: str, test_cases: list[dict]) -> None:
    params = [p.strip() for p in params.split(",")]
    for case in test_cases:
        if (
            case.get("expected_output_type") is None
            or case.get("input_types") is None
            or case.get("inputs") is None
            or case.get("expected_output") is None
        ):
            raise Exception(
                "Expected output type, input types, inputs, or expected output is missing."
            )

        # Check expected output type
        if not isinstance(case["expected_output"], eval(case["expected_output_type"])):
            raise Exception("Mismatched expected output type.")

        if len(case["input_types"].items()) != len(case["inputs"].items()):
            raise Exception("Mismatched input types and inputs.")

        for idx, ((arg1, value), (arg2, value_type)) in enumerate(
            zip(case["inputs"].items(), case["input_types"].items())
        ):
            # Check if the keys match
            if arg1 != arg2:
                raise Exception(f"Arg mismatch {arg1} != {arg2}")

            # Check if the types match
            if not isinstance(value, eval(value_type)):
                raise Exception(f"Type mismatch {value} != {value_type}")

            # Check if the input type matches the function signature
            if params[idx].split(":")[1].strip() != value_type:
                raise Exception(
                    f"Input type mismatch: {params[idx].split(':')[1].strip()} != {value_type}"
                )

            # Check if the input key matches the function signature
            if params[idx].split(":")[0].strip() != arg1:
                raise Exception(
                    f"Input key mismatch: {params[idx].split(':')[0].strip()} != {arg1}"
                )


def extract_test_cases(fn_name: str, test_cases: list[dict]) -> str:
    aggregated_cases = ["# Test cases"]
    for case in test_cases:
        args, args_hash = generate_args_hash(case)
        statement = f"        results['{args_hash}'] = {fn_name}({args})"
        aggregated_cases.append(statement)

    test_code = "\n".join(aggregated_cases)
    return test_code
