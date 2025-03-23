def generate_script(code: str, iterations: int, test_code: str, timeout: int = 5000) -> str:
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
    runtimes = []

    for i in range({iterations}):
        try:
            # Start the alarm before running the test code
            signal.alarm({timeout})
            start = time.perf_counter()
            {test_code}
            end = time.perf_counter()
            runtimes.append(end - start)
        except TimeoutException:
            # Record the timeout occurrence for this iteration
            runtimes.append({timeout})
        finally:
            # Cancel the alarm after the iteration
            signal.alarm(0)

    gc.enable()

    return {{
        'stdout': results,
        'runtime': sorted(runtimes)[len(runtimes) // 2]
    }}

if __name__ == '__main__':
    print(json.dumps(run(), indent=4))
"""
    return script
