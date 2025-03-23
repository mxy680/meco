# db.py
from prisma import Prisma, Json

db = Prisma()


def create_job():
    return db.job.create(
        {
            "status": "running",
        }
    )


def end_job(job_id: int):
    return db.job.update(
        where={"id": job_id},
        data={"status": "completed"},
    )


def fail(job_id: int):
    return db.job.update(
        where={"id": job_id},
        data={"status": "failed"},
    )


def update_job(job_id: int, data: dict):
    return db.job.update(
        where={"id": job_id},
        data={"tree": Json(data)},
    )
