import pytest
import docker
from runner.client import Runner

@pytest.fixture(scope="module")
def runner():
    """Fixture to initialize Runner once and reuse the same container."""
    r = Runner("python")
    r.start_container()
    yield r  # Provide the runner instance to tests
    r.stop_container()  # Stop container after all tests

def test_initialize_docker_client(runner):
    """Test if the Docker client initializes correctly inside the Runner class."""
    assert isinstance(runner.client, docker.DockerClient)

def test_invalid_language():
    """Test that initializing Runner with an unsupported language raises an error."""
    with pytest.raises(ValueError, match="Unsupported language"):
        Runner("invalid_language")

def test_ensure_image_exists(mocker, runner):
    """Test that Runner checks for the required Docker image before execution."""
    mocker.patch.object(runner.client.images, "get", return_value=True)
    assert runner._ensure_image_exists() is None  # Should not raise errors

def test_create_container(runner):
    """Test that the container is still running across tests."""
    assert runner.container is not None

def test_run_code(mocker, runner):
    """Test running a simple Python code snippet inside the container."""
    mock_exec_result = mocker.Mock()
    mock_exec_result.exit_code = 0
    mock_exec_result.output = b"Hello, world!\n"

    mocker.patch.object(runner.container, "exec_run", return_value=mock_exec_result)

    result = runner.run("print('Hello, world!')")

    assert result["exit_code"] == 0
    assert result["stdout"] == "Hello, world!\n"
