from runner.utils.cpu import calculate_cpu_percent
from .script import generate_script, generate_script_with_input_generator
import json
import uuid


def run_code(container, function, test_code):
    script = generate_script(function, test_code)
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
            "exit_code": result.exit_code,
        }

    except Exception as e:
        return {"error": str(e)}


def run_terminal_command(container, command: str) -> dict:
    try:
        # Execute the command in the container using bash
        exec_result = container.exec_run(
            cmd=["bash", "-c", command], stdout=True, stderr=True
        )
        output = exec_result.output.decode("utf-8").strip()
        return {
            "stdout": output,
            "exit_code": exec_result.exit_code,
        }
    except Exception as e:
        return {"stdout": str(e), "exit_code": 1}


def run_input_generator(container, function, input_generator, n: int = 1000):
    script = generate_script_with_input_generator(function, input_generator, n)
    script_name = f"input-generator-{uuid.uuid4().hex}.py"
    command = (
        f'echo "{script}" > /tmp/{script_name} && poetry run python /tmp/{script_name}'
    )

    try:
        result = container.exec_run(
            cmd=["bash", "-c", command], stdout=True, stderr=True
        )

        raw_output = result.output.decode().strip()

        try:
            return {"stdout": json.loads(raw_output), "exit_code": 0}
        except Exception as e:
            return {"stdout": raw_output, "exit_code": 1}

    except Exception as e:
        return {"error": str(e)}
