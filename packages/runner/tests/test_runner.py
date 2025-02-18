import pytest
import docker
from runner.client import Runner


@pytest.fixture(scope="module")
def runner():
    """Fixture to initialize Runner once and reuse the same container."""
    r = Runner("python")
    r.start_container()
    yield r  # Provide the runner instance to tests
    # r.stop_container()  # Stop container after all tests


def test_initialize_docker_client(runner):
    """Test if the Docker client initializes correctly inside the Runner class."""
    assert isinstance(runner.client, docker.DockerClient)


def test_invalid_language():
    """Test that initializing Runner with an unsupported language raises an error."""
    with pytest.raises(ValueError, match="Unsupported language"):
        Runner("invalid_language")


def test_ensure_image_exists(runner):
    """Test that Runner pulls the required Docker image before execution."""
    runner.container._ensure_image_exists()  # Calls actual Docker API
    assert runner.client.images.get(runner.container.image)  # Confirms image exists


def test_create_container(runner):
    """Test that the container is still running across tests."""
    assert runner.container.container is not None


def test_run_code(runner):
    """Test that the container runs the code and returns the output."""
    code = "print('Hello, World!')"
    output = runner.run(code)
    assert output["stdout"] == "Hello, World!\n"


def test_run_code_with_error(runner):
    """Test that the container runs the code and returns the error."""
    code = "print('Hello, World)"
    output = runner.run(code)
    assert "SyntaxError:" in output["stdout"]


def test_run_code_function(runner):
    """Test that the container runs the code and returns the output."""
    code = "def add(a, b):\n    return a + b\nprint(add(2, 3))"
    output = runner.run(code)
    assert output["stdout"] == "5\n"
