from .execution.python.run import run_code as run_python_code

LANGUAGE_CONFIGS = {
    "python": {
        "image": "markshteyn1/python-runner:latest",
        "file_extension": ".py",
        "run_function": run_python_code,
    }
}
