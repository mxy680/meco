# FastAPI backend

This FastAPI server uses Poetry for dependency management.

## Usage

1. Install Poetry if you haven't already:
   https://python-poetry.org/docs/#installation

2. Install dependencies:
   ```
   poetry install
   ```

3. Run the server:
   ```
   poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
