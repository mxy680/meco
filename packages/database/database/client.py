# db.py
from prisma import Prisma, Json

db = Prisma()


async def create_job():
    return await db.job.create(
        {
            "status": "running",
        }
    )


async def end_job(job_id: int):
    return await db.job.update(
        where={"id": job_id},
        data={"status": "completed"},
    )


async def fail(job_id: int):
    return await db.job.update(
        where={"id": job_id},
        data={"status": "failed"},
    )


async def update_job(job_id: int, data: dict):
    return await db.job.update(
        where={"id": job_id},
        data={"tree": Json(data)},
    )
