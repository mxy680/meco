from runner.execution import utils
import json


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


def run_code_python(
    container,
    code: str,
    fn: dict,
    test_cases,
    script_name,
    run_command,
    iterations=100,
    workdir="/code",
):
    if container.container is None:
        raise RuntimeError("Container is not running. Call start_container() first.")

    # Generate test case execution logic
    test_code = aggregate_test_cases(fn, test_cases)

    # Wrap extracted function inside a `run()` function that times execution
    script = f"""
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
    print(json.dumps(run(), indent=4))  # ✅ Proper JSON formatting
"""

    # Write the script to the container and execute it
    command = (
        f'echo "{script}" > {script_name} && {run_command.format(file=script_name)}'
    )

    try:
        # Get initial container metrics
        stats_before = container.container.stats(stream=False)

        exec_result = container.container.exec_run(
            cmd=["bash", "-c", command], workdir=workdir, stdout=True, stderr=True
        )

        # Get container metrics after execution
        stats_after = container.container.stats(stream=False)

        # Compute CPU usage
        cpu_percent = utils.calculate_cpu_percent(stats_before, stats_after)
        memory_usage = stats_after["memory_stats"]["usage"]

        return {
            "stdout": exec_result.output.decode().strip(),
            "exit_code": exec_result.exit_code,
            "cpu_percent": cpu_percent,
            "memory_usage": memory_usage,
        }

    except Exception as e:
        return {"error": str(e)}
