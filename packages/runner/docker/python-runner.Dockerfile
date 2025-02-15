# Use an official Python base image
FROM python:3.10

# Create a non-root user for security
RUN useradd -m sandboxuser

# Create the /code directory and set ownership to the non-root user
RUN mkdir -p /code && chown sandboxuser:sandboxuser /code

# Set the working directory inside the container
WORKDIR /code

# Switch to the non-root user
USER sandboxuser

# Default command: Run Python script inside /code
CMD ["python3", "/code/script.py"]
