FROM python:3.10-slim

WORKDIR /app

# Create required directories and files for project skeleton
RUN mkdir -p data scripts models figs docs config 

# Install curl and Jupyter Kernel Gateway and Python kernel
RUN apt-get update && apt-get install -y curl \
    && pip install --no-cache-dir jupyter_kernel_gateway ipykernel \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose Jupyter Kernel Gateway port
EXPOSE 8888

# Install Python websocket-client
RUN pip install websocket-client

# Copy WebSocket execution script
COPY docker/ws_execute.py /usr/local/bin/ws_execute.py

# Default: Run Jupyter Kernel Gateway in websocket mode
CMD ["jupyter", "kernelgateway", "--KernelGatewayApp.api=kernel_gateway.jupyter_websocket", "--port=8888", "--KernelGatewayApp.auth_token=''"]