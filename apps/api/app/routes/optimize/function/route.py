from fastapi import APIRouter
from app.models import OptimizationRequest
from app.src.optimization.python import optimize_python

router = APIRouter()


@router.post("/python")
async def optimize(request: OptimizationRequest):
    return await optimize_python(request)
