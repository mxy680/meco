from contextlib import asynccontextmanager
from fastapi import FastAPI
from database.client import db
from app.routes.optimize.route import router as optimization_router
from app.routes.query.route import router as query_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()  # Start the database client on startup
    yield
    await db.disconnect()  # Disconnect on shutdown


app = FastAPI(lifespan=lifespan)
app.include_router(optimization_router, prefix="/api/optimize")
app.include_router(query_router, prefix="/api/query")
