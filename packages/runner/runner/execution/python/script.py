def generate_script(code: str, iterations: int, test_code: str) -> str:
    return f"""
import time
import json
import gc
import os

# Pin CPU to core 0 (Handled OS exceptions)
try:
    os.sched_setaffinity(0, {{0}}) 
except AttributeError:
    pass  # Ignore if not supported

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
