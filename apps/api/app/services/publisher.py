import asyncio
import json
from aio_pika import connect_robust, Message, DeliveryMode

async def publish_job(job_id: int, payload: dict, job_type: str):
    # Connect to RabbitMQ asynchronously
    connection = await connect_robust("amqp://guest:guest@localhost/")
    async with connection:
        channel = await connection.channel()
        
        # Ensure the queue exists (durable ensures messages aren't lost)
        await channel.declare_queue("job_queue", durable=True)
        
        # Create the message as JSON and encode it
        message_body = json.dumps({
            "job_id": job_id,
            "payload": payload,
            "job_type": job_type,
        }).encode()

        message = Message(message_body, delivery_mode=DeliveryMode.PERSISTENT)
        
        # Publish the message using the default exchange with routing key set to the queue name
        await channel.default_exchange.publish(message, routing_key="job_queue")
        print(f"Published job {job_id} to job_queue.")