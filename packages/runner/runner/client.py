import docker
import uuid
from runner.configs import LANGUAGE_CONFIGS
import logging



class Runner:
    def __init__(self, language: str):
        if language not in LANGUAGE_CONFIGS:
            raise ValueError(f"Unsupported language: {language}")

        self.client = docker.from_env()
        self.language = language
        self.config = LANGUAGE_CONFIGS[language]
        self.container_name = f"runtest-{uuid.uuid4().hex}"
        self.script_name = f"script{self.config['file_extension']}"
        self.container_workdir = "/code"
        self.docker_command = self.config["run_command"].format(
            file=f"{self.container_workdir}/{self.script_name}"
        )
        self.container = None  # Store the container instance

    def _ensure_image_exists(self):
        """Ensure the Docker image is available by pulling it."""
        print(f"Pulling Docker image: {self.config['image']}...")
        try:
            self.client.images.pull(self.config["image"])
            print(f"Successfully pulled {self.config['image']}")
        except Exception as e:
            print(f"Failed to pull image: {e}")
            raise e

    def start_container(self):
        """Start a persistent container to execute multiple snippets."""
        if self.container is None:
            print(f"Starting persistent container: {self.container_name}")
            self._ensure_image_exists()

            self.container = self.client.containers.run(
                self.config["image"],
                command="tail -f /dev/null",  # Keeps container alive
                name=self.container_name,
                remove=True,
                stdin_open=True,
                working_dir=self.container_workdir,
                network_disabled=True,
                detach=True,
            )

            print(f"Container {self.container_name} started successfully.")

    def run(self, code: str):
        if self.container is None:
            raise RuntimeError("Container is not running. Call start_container() first.")
        
        # Construct the command to write `code` into script_name and then run it.
        command = (
            f'echo "{code}" > {self.script_name} && '
            f'{self.config["run_command"].format(file=self.script_name)}'
        )

        try:
            # Run the single shell command non-interactively
            exec_result = self.container.exec_run(
                cmd=["bash", "-c", command],
                workdir=self.container_workdir,  # Make sure you're in the right directory
                stdout=True,
                stderr=True
            )

            output = exec_result.output.decode("utf-8")
            print(f"Output: {output}")
            return {"stdout": output, "exit_code": exec_result.exit_code}
        except Exception as e:
            return {"error": str(e)}


    def stop_container(self):
        """Stops the container after the evolution process is complete."""
        if self.container:
            print(f"Stopping container {self.container_name}...")
            self.container.stop()
            self.container = None
            print(f"Container {self.container_name} stopped.")
