FROM python:3.10-slim

WORKDIR /app

# Create required directories and files for project skeleton
RUN mkdir -p data scripts models figs docs config 

# Install Jupyter Kernel Gateway and Python kernel
RUN pip install --no-cache-dir jupyter_kernel_gateway ipykernel

# Expose Jupyter Kernel Gateway port
EXPOSE 8888

# Default: Run Jupyter Kernel Gateway in websocket mode
CMD ["jupyter", "kernelgateway", "--KernelGatewayApp.api=kernel_gateway.jupyter_websocket", "--port=8888"]