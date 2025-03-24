import asyncio
import json
from aio_pika import connect_robust, IncomingMessage
from database.client import db
from optimization.function import optimize_function

async def process_job(job_id: int, payload: dict, job_type: str):
    if job_type == "function":
        # Await optimize_function directly if it's async.
        await optimize_function(job_id, payload)

async def on_message(message: IncomingMessage):
    async with message.process():
        try:
            data = json.loads(message.body.decode())
            job_id = data.get("job_id")
            # If payload is stored as a JSON string within the message, decode it:
            payload = json.loads(data.get("payload"))
            job_type = data.get("job_type")
            print(f"Received {job_type} job {job_id}")
            await process_job(job_id, payload, job_type)
        except Exception as e:
            print(f"Error processing job: {e}")

async def start_consumer():
    # Connect to RabbitMQ asynchronously
    connection = await connect_robust("amqp://guest:guest@localhost/")
    async with connection:
        # Ensure the database client is connected before processing any messages
        await db.connect()
        try:
            channel = await connection.channel()
            await channel.set_qos(prefetch_count=1)
            queue = await channel.declare_queue("job_queue", durable=True)
            await queue.consume(on_message)
            print("Consumer waiting for messages. To exit press CTRL+C")
            await asyncio.Future()  # Keep the consumer running indefinitely
        finally:
            await db.disconnect()

if __name__ == "__main__":
    asyncio.run(start_consumer())
