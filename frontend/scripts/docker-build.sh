#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t huggingface-explorer:latest .

echo "Docker image built successfully!"
echo "Run the container with: docker run -p 3000:3000 huggingface-explorer:latest"
