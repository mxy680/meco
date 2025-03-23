from contextlib import asynccontextmanager
from fastapi import FastAPI
from database.client import db
from app.routes.optimize.route import router as optimization_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()  # Start the database client on startup
    yield
    await db.disconnect()  # Disconnect on shutdown


app = FastAPI(lifespan=lifespan)
app.include_router(optimization_router, prefix="/api/optimize")
