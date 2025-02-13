LANGUAGE_CONFIGS = {
    "python": {
        "image": "python:3.10",
        "run_command": "python3 /code/run.py",
        "file_extension": "py",
    },
    "javascript": {
        "image": "node:18",
        "run_command": "node /code/run.js",
        "file_extension": "js",
    },
    "cpp": {
        "image": "gcc:latest",
        "compile_command": "g++ /code/run.cpp -o /code/run.out",
        "run_command": "/code/run.out",
        "file_extension": "cpp",
    },
}
