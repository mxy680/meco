from .utils import aggregate_test_cases
from .script import generate_script
from ..run_utils import run_code


def run_code_python(
    container,
    code: str,
    test_code: str,
    script_name: str,
    run_command: str,
    iterations: int,
    workdir: str = "/code",
    verbose: bool = False,
):
    if container.container is None:
        raise RuntimeError("Container is not running. Call start_container() first.")

    script = generate_script(code, iterations, test_code)

    # Write the script to the container and execute it
    command = (
        f'echo "{script}" > {script_name} && {run_command.format(file=script_name)}'
    )

    return run_code(container, command, workdir)
