from fastapi import APIRouter
from database.models import OptimizationRequest  # Adjust the import as needed.
from app.services.publisher import publish_job  # Import the publisher helper
from database.client import db  # Import the database client

router = APIRouter()


@router.post("/function")
async def optimize_function(request: OptimizationRequest):
    # Create a new job record with initial status "pending"
    job = await db.job.create(data={"status": "pending"})
    job_id = job.id
    payload = request.model_dump_json()

    # Publish the job to RabbitMQ using Pika
    await publish_job(job_id, payload, "function")

    # Return the job ID immediately so the client can track progress
    return {"job_id": job_id}
