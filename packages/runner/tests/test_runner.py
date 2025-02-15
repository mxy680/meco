import pytest
import docker
from runner.client import Runner


def test_initialize_docker_client():
    """Test if the Docker client initializes correctly inside the Runner class."""
    runner = Runner("python")  # Ensure 'python' is a valid key in LANGUAGE_CONFIGS
    assert isinstance(runner.client, docker.DockerClient)


def test_invalid_language():
    """Test that initializing Runner with an unsupported language raises an error."""
    with pytest.raises(ValueError, match="Unsupported language"):
        Runner("invalid_language")


def test_ensure_image_exists(mocker):
    """Test that Runner checks for the required Docker image before execution."""
    runner = Runner("python")

    # Mock Docker image existence check
    mocker.patch.object(runner.client.images, "get", return_value=True)

    assert runner._ensure_image_exists() is None  # Should not raise errors


def test_create_container(mocker):
    """Test that a container is created successfully before execution and is properly stopped."""
    runner = Runner("python")

    mock_container = mocker.Mock()
    mocker.patch.object(runner.client.containers, "run", return_value=mock_container)

    try:
        runner.start_container()
        assert runner.container is not None
    finally:
        runner.stop_container()
        assert runner.container is None


def test_run_code(mocker):
    """Test running a simple Python code snippet inside the container."""
    runner = Runner("python")

    mock_container = mocker.Mock()
    mock_exec_result = mocker.Mock()
    mock_exec_result.exit_code = 0
    mock_exec_result.output = b"Hello, world!\n"

    # Mock Docker methods
    mocker.patch.object(runner.client.containers, "run", return_value=mock_container)
    mocker.patch.object(mock_container, "exec_run", return_value=mock_exec_result)

    try:
        runner.start_container()
        result = runner.run("print('Hello, world!')")

        assert result["exit_code"] == 0
        assert result["stdout"] == "Hello, world!\n"
    finally:
        runner.stop_container()
        assert runner.container is None
