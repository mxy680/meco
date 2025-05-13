# syntax=docker/dockerfile:1
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies with pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Create required directories and files for project skeleton
RUN mkdir -p data scripts models figs docs \
    && touch scripts/ingest.py scripts/preprocess.py scripts/model.py scripts/train.py scripts/eval.py scripts/viz.py

# Default command (can be overridden)
CMD ["tail", "-f", "/dev/null"]
