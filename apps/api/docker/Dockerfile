# syntax=docker/dockerfile:1
FROM python:3.10-slim

WORKDIR /app

# Create required directories and files for project skeleton
RUN mkdir -p data scripts models figs docs config

# Default command (can be overridden)
CMD ["tail", "-f", "/dev/null"]
