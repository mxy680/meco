#!/bin/bash

# Define variables
CONTAINER_NAME="ollama_server"
OLLAMA_IMAGE="ollama/ollama"
OLLAMA_PORT=11434  # Default Ollama API port
MODELS=("codellama")

# Check if Ollama is already running
if docker ps --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
    echo "Ollama container ($CONTAINER_NAME) is already running."
else
    echo "Starting Ollama container..."
    docker run -d --name "$CONTAINER_NAME" -p $OLLAMA_PORT:11434 --restart always "$OLLAMA_IMAGE"
    
    # Wait for the container to initialize
    sleep 5
fi

# Pull the required models inside the running container
echo "Pulling models..."
for MODEL in "${MODELS[@]}"; do
    echo "Pulling $MODEL..."
    docker exec "$CONTAINER_NAME" ollama pull "$MODEL"
done

echo "Ollama container ($CONTAINER_NAME) is running and models are ready for inference."
