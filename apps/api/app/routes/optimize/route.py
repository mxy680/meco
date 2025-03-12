from fastapi import APIRouter
from app.models import OptimizationRequest
from app.controllers.optimization.function.python import optimize_python

router = APIRouter()


@router.post("/optimize/python")
async def optimize(request: OptimizationRequest):
    return optimize_python(request)
