import json
from parser.utils import generate_args_hash


def validate_output(test_cases: list[dict], output: dict) -> None:
    for case in test_cases:
        _, args_hash = generate_args_hash(case)
        if args_hash not in output:
            raise Exception(
                "Test case not found in output: " + json.dumps(case["inputs"])
            )
        if output[args_hash] != case["expected_output"]:
            raise Exception(
                "Test case failed: "
                + json.dumps(case["inputs"])
                + " -> "
                + json.dumps(case["expected_output"])
            )
