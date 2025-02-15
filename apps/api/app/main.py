from fastapi import FastAPI
from app.routes.optimize import optimize_router

app = FastAPI()

app.include_router(optimize_router, prefix="/api")
