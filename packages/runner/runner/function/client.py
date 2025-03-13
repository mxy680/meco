from .config import LANGUAGE_CONFIGS
import docker
import uuid
import time


class Runner:
    def __init__(self, language: str, test_code: str):
        if language not in LANGUAGE_CONFIGS:
            raise ValueError(f"Unsupported language: {language}")

        self.config = LANGUAGE_CONFIGS[language]
        self.docker_image = self.config["image"]
        self.container_name = f"runtest-{uuid.uuid4().hex}"
        self.client = docker.from_env()
        self.container = None
        self.test_code = test_code

    def start_container(self):
        # If a container with the same name already exists, remove it.
        try:
            old_container = self.client.containers.get(self.container_name)
            print("Container already exists. Stopping and removing it.")
            old_container.stop()
            old_container.remove()
        except docker.errors.NotFound:
            pass

        # Run the container in detached mode.
        self.container = self.client.containers.run(
            self.docker_image,
            name=self.container_name,
            detach=True,
            # Ensure the container stays alive with a command like "tail -f /dev/null"
            command="tail -f /dev/null",
        )
        # Allow time for the container to initialize.
        time.sleep(2)
        return self.container

    def terminal(self, command: str) -> dict:
        if self.container is None:
            raise RuntimeError("Container is not running. Call start_container() first.")
        
        try:
            # Execute the command in the container using bash
            exec_result = self.container.exec_run(cmd=["bash", "-c", command], stdout=True, stderr=True)
            output = exec_result.output.decode("utf-8").strip()
            return {
                "stdout": output,
                "exit_code": exec_result.exit_code,
            }
        except Exception as e:
            return {"stdout": str(e)}


    def run(self, code: str):
        if self.container is None:
            raise RuntimeError(
                "Container is not running. Call start_container() first."
            )

        return self.config["run_function"](self.container, code, self.test_code)
