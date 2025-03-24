from fastapi import APIRouter, Query
from database.models import JobRequest  # Adjust the import as needed.
from database.client import db  # Import the database client
import json

router = APIRouter()


@router.get("/job")
async def read_root(job_id: int = Query(...)):
    response = await db.job.find_unique(where={"id": job_id})
    if response is None:
        return {"status": 404, "data": {"message": "Job not found"}}

    return {"status": response.status, "data": response.tree}