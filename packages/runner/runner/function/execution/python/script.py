def generate_script(code: str, iterations: int, test_code: str) -> str:
    code = code.replace('"', "'")
    return f"""
import time
import json
import gc
import os

{code}

def run():
    gc.collect()
    gc.disable()

    results = {{}}

    runtimes = []
    for _ in range({iterations}):
        start = time.perf_counter()
{test_code}  
        end = time.perf_counter()
        runtimes.append(end - start)

    gc.enable() 

    return {{
        'stdout': results,
        'runtime': sorted(runtimes)[len(runtimes) // 2]
    }}

if __name__ == '__main__':
    print(json.dumps(run(), indent=4))
"""
