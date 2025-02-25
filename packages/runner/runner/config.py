from runner.execution.python.run import run_code

LANGUAGE_CONFIGS = {
    "python": {
        "image": "markshteyn1/python-runner:latest",
        "file_extension": ".py",
        "run_function": run_code,
    }
}
