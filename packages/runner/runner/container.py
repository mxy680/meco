import docker
import uuid


class ContainerManager:
    def __init__(self, image: str):
        self.client = docker.from_env()
        self.image = image
        self.container_name = f"runtest-{uuid.uuid4().hex}"
        self.container = None

    def _ensure_image_exists(self):
        print(f"Pulling Docker image: {self.image}...")
        try:
            self.client.images.pull(self.image)
            print(f"Successfully pulled {self.image}")
        except Exception as e:
            print(f"Failed to pull image: {e}")
            raise e

    def start(self):
        if self.container is None:
            print(f"Starting container: {self.container_name}")
            self._ensure_image_exists()
            self.container = self.client.containers.run(
                self.image,
                command="tail -f /dev/null",
                name=self.container_name,
                remove=True,
                stdin_open=True,
                network_disabled=True,
                detach=True,
            )
            print(f"Container {self.container_name} started.")

    def stop(self):
        if self.container:
            print(f"Stopping container {self.container_name}...")
            self.container.stop()
            self.container = None
            print(f"Container {self.container_name} stopped.")
