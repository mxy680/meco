import docker
import os
import subprocess
import uuid
from runner.language_configs import LANGUAGE_CONFIGS


def run_code_in_docker(code: str, language: str, test_cases: list):
    """
    Runs the given code inside a Docker container for the specified language.

    Args:
        code (str): The function code.
        language (str): The programming language.
        test_cases (list): Test cases as inputs.

    Returns:
        dict: Output, execution time, and memory usage.
    """
    if language not in LANGUAGE_CONFIGS:
        raise ValueError(f"Unsupported language: {language}")

    config = LANGUAGE_CONFIGS[language]
    file_extension = config["file_extension"]
    container_name = f"runtest-{uuid.uuid4().hex}"

    os.makedirs("temp_code", exist_ok=True)
    code_path = f"temp_code/run.{file_extension}"

    with open(code_path, "w") as f:
        f.write(code)

    test_path = f"temp_code/test_cases.txt"
    with open(test_path, "w") as f:
        for case in test_cases:
            f.write(f"{case}\n")

    client = docker.from_env()
    try:
        container = client.containers.run(
            config["image"],
            command=config.get("compile_command", "") + " && " + config["run_command"],
            volumes={os.path.abspath("temp_code"): {"bind": "/code", "mode": "rw"}},
            name=container_name,
            detach=True,
            mem_limit="512m",  # 512MB RAM limit
            cpu_period=100000,
            cpu_quota=50000,  # 50% of 1 CPU
        )

        result = container.wait()
        logs = container.logs().decode("utf-8")

        # Extract runtime & memory metrics
        metrics = get_metrics(container_name)

    finally:
        container.remove(force=True)
        os.system("rm -rf temp_code")

    return {"output": logs.strip(), "metrics": metrics}


def get_metrics(container_name):
    """
    Gets CPU and memory usage from the Docker stats.

    Args:
        container_name (str): The name of the container.

    Returns:
        dict: Execution time, memory, and CPU usage.
    """
    stats = subprocess.run(
        f"docker stats --no-stream {container_name}",
        shell=True,
        capture_output=True,
        text=True,
    ).stdout

    # Example parsing (adjust for different Docker output formats)
    lines = stats.split("\n")[1].split()
    return {
        "cpu_usage": lines[2],
        "memory_usage": lines[3],
        "execution_time": "N/A",  # Need better method to extract precise runtime
    }
