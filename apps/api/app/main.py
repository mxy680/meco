# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes.optimize import function_optimization_router
from app.database.client import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(lifespan=lifespan)

app.include_router(function_optimization_router, prefix="/api/function")
