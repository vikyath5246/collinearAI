#!/bin/bash

# Run the Docker container
echo "Starting Docker container..."
docker run -p 3000:3000 huggingface-explorer:latest

# The container will keep running until stopped with Ctrl+C
