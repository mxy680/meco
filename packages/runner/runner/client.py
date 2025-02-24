import docker
from .configs import LANGUAGE_CONFIGS
from .container import ContainerManager
from .execution import run_code_python
from typing import Union
import hashlib


class Runner:
    def __init__(self, language: str, verbose: bool = False):
        if language not in LANGUAGE_CONFIGS:
            raise ValueError(f"Unsupported language: {language}")

        self.client = docker.from_env()
        self.language = language
        self.config = LANGUAGE_CONFIGS[language]
        self.container_workdir = "/code"
        self.script_name = f"script{self.config['file_extension']}"
        self.docker_command = self.config["run_command"].format(
            file=f"{self.container_workdir}/{self.script_name}"
        )
        self.container = ContainerManager(self.config["image"], verbose=verbose)

    def start_container(self):
        """Start a persistent container to execute multiple snippets."""
        self.container.start()

    def run(self, code: str, test_code: str, iterations: int = 100):
        match self.language:
            case "python":
                return run_code_python(
                    self.container,
                    code,
                    test_code,
                    self.script_name,
                    self.config["run_command"],
                    iterations,
                )
            case _:
                raise ValueError(f"Unsupported language: {self.language}")

    def stop_container(self):
        """Stops the container after the evolution process is complete."""
        self.container.stop()

    @staticmethod
    def verify_tests(test_cases: dict, output: dict) -> Union[True, str]:
        for case in test_cases:
            args = ", ".join([f"{k}={v}" for k, v in case.inputs.items()])
            args_hash = hashlib.md5(args.encode()).hexdigest()
            if not output[args_hash] == case.expected_output:
                return f"Invalid output for case: {case}"

    @staticmethod
    def display_metrics(metrics: dict):
        print(
            "\n📊 Metrics:"
            f"\nRuntime: {round(metrics['runtime'], 10)}ms"
            f"\nMemory Usage: {round(metrics['memory_usage'], 5)}MB"
            f"\nCPU Usage: {round(metrics['cpu_percent'], 5)}%"
        )
