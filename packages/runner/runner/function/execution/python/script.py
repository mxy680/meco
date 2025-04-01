def generate_script(code: str, test_code: str, timeout: int = 10) -> str:
    code = code.replace('"', "'")
    script = f"""
import time
import json
import gc
import os
import signal

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException()

signal.signal(signal.SIGALRM, timeout_handler)

{code}

def run():
    gc.collect()
    gc.disable()

    results = {{}}
    
    try:
        # Start the alarm before running the test code
        signal.alarm({timeout})
        start = time.perf_counter()
        {test_code}
        end = time.perf_counter()
        runtime = end - start
    except TimeoutException:
        runtime = {timeout}
    finally:
        # Cancel the alarm after the test code
        signal.alarm(0)
    
    gc.enable()

    return {{
        'stdout': results,
        'runtime': runtime
    }}

if __name__ == '__main__':
    print(json.dumps(run(), indent=4))
"""
    return script


def generate_script_with_input_generator(
    function: str, input_generator: str, n: int
) -> str:
    # Replace double quotes with single quotes to avoid conflicts in the generated script.
    input_generator = input_generator.replace('"', "'")
    function = function.replace('"', "'")
    script = f"""
import json

# Injected input generator function code
{input_generator}

# Injected naive function code
{function}

if __name__ == '__main__':
    # Generate test cases using the input generator function
    test_cases = input_generator({n})
    results = []
    for test_case in test_cases:
        output = {function.split()[1].split("(")[0]}(**test_case)
        results.append({{'inputs': test_case, 'expected_output': output}})
    # Print the results as a JSON string
    print(json.dumps(results, indent=4))
"""
    return script
