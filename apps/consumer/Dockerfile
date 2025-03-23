FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the consumer code and shared modules
COPY . .

CMD ["python", "consumer.py"]