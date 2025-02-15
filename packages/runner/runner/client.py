import docker
from .configs import LANGUAGE_CONFIGS
from .executor import CodeExecutor
from .container import ContainerManager


class Runner:
    def __init__(self, language: str):
        if language not in LANGUAGE_CONFIGS:
            raise ValueError(f"Unsupported language: {language}")

        self.client = docker.from_env()
        self.config = LANGUAGE_CONFIGS[language]
        self.container_workdir = "/code"
        self.script_name = f"script{self.config['file_extension']}"
        self.docker_command = self.config["run_command"].format(
            file=f"{self.container_workdir}/{self.script_name}"
        )
        self.container = ContainerManager(self.config["image"])

    def start_container(self):
        """Start a persistent container to execute multiple snippets."""
        self.container.start()

    def run(self, code: str):
        return CodeExecutor.run_code(
            self.container, code, self.script_name, self.config["run_command"]
        )

    def stop_container(self):
        """Stops the container after the evolution process is complete."""
        self.container.stop()