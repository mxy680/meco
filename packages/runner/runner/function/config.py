from .execution.python.run import run_code as run_python_code
from .execution.python.run import run_input_generator as run_python_input_generator
from .execution.python.run import run_terminal_command as run_python_terminal_command

LANGUAGE_CONFIGS = {
    "python": {
        "image": "markshteyn1/python-runner:latest",
        "file_extension": ".py",
        "run_function": run_python_code,
        "run_terminal_command": run_python_terminal_command,
        "run_input_generator": run_python_input_generator,
    }
}
