from .cpu_utils import calculate_cpu_percent
import json


def run_code(container, command, workdir):
    try:
        # Get initial container metrics
        stats_before = container.container.stats(stream=False)

        exec_result = container.container.exec_run(
            cmd=["bash", "-c", command], workdir=workdir, stdout=True, stderr=True
        )

        # Get container metrics after execution
        stats_after = container.container.stats(stream=False)

        # Compute CPU usage
        cpu_percent = calculate_cpu_percent(stats_before, stats_after)
        memory_usage = stats_after["memory_stats"]["usage"]

        # Get the output
        raw_output = exec_result.output.decode().strip()

        try:
            json_output = json.loads(raw_output)
            stdout = json_output["stdout"]
            runtime = json_output["runtime"]
        except:
            return {
                "stdout": raw_output,
                "exit_code": exec_result.exit_code,
            }

        return {
            "stdout": stdout,
            "runtime": runtime,
            "cpu_percent": cpu_percent,
            "memory_usage": memory_usage,
        }

    except Exception as e:
        return {"error": str(e)}
