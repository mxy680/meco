from runner.utils.cpu import calculate_cpu_percent
from .script import generate_script
import json
import uuid


def run_code(container, function, test_code, iterations=100, timeout=10000):
    script = generate_script(function, iterations, test_code)
    script_name = f"script-{uuid.uuid4().hex}.py"

    # Write the script to the container and execute it
    command = (
        f'echo "{script}" > /tmp/{script_name} && poetry run python /tmp/{script_name}'
    )

    try:
        # Get initial container metrics
        stats_before = container.stats(stream=False)

        result = container.exec_run(
            cmd=["bash", "-c", command], stdout=True, stderr=True
        )

        # Get container metrics after execution
        stats_after = container.stats(stream=False)

        # Compute CPU usage
        cpu_percent = calculate_cpu_percent(stats_before, stats_after)
        memory_usage = stats_after["memory_stats"]["usage"]

        # Get the output
        raw_output = result.output.decode().strip()

        try:
            json_output = json.loads(raw_output)
            stdout = json_output["stdout"]
            runtime = json_output["runtime"]
        except Exception as e:
            return {
                "stdout": raw_output,
                "exit_code": result.exit_code,
            }

        return {
            "stdout": stdout,
            "runtime": runtime,
            "cpu_percent": cpu_percent,
            "memory_usage": memory_usage,
        }

    except Exception as e:
        return {"error": str(e)}
