import docker
import uuid


class ContainerManager:
    def __init__(self, image: str, verbose: bool = False):
        self.client = docker.from_env()
        self.image = image
        self.container_name = f"runtest-{uuid.uuid4().hex}"
        self.container = None
        self.verbose = verbose

    def _ensure_image_exists(self):
        if self.verbose:
            print(f"Pulling Docker image: {self.image}...")
        try:
            self.client.images.pull(self.image)
            if self.verbose:
                print(f"Successfully pulled {self.image}")
        except Exception as e:
            if self.verbose:
                print(f"Error pulling {self.image}: {e}")
            raise e

    def start(self):
        if self.container is None:
            if self.verbose:
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
                cpuset_cpus="0",
                mem_limit="2g",
                memswap_limit="2g",  # <== Prevents additional memory swap
            )

            if self.verbose:
                print(f"Container {self.container_name} started.")

    def stop(self):
        if self.container:
            if self.verbose:
                print(f"Stopping container {self.container_name}...")
            self.container.stop()
            self.container = None
            if self.verbose:
                print(f"Container {self.container_name} stopped.")
