FROM python:3.12-slim

# Install required packages and curl for Poetry installation.
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install Poetry.
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Set the working directory.
WORKDIR /app

# Copy your existing pyproject.toml into the container.
COPY pyproject.toml /app/pyproject.toml

# Ensure there's an empty README.md (Poetry may require it).
RUN touch README.md

# Install the project dependencies as defined in your pyproject.toml.
RUN poetry install --no-root

# Keep the container running persistently.
CMD ["tail", "-f", "/dev/null"]
