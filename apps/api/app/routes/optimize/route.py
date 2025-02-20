from fastapi import APIRouter
from app.models import OptimizationRequest
from optimizer.optimizer import optimize_function
from app.controllers.optimization import optimize_function

router = APIRouter()


@router.post("/optimize/python")
async def optimize(request: OptimizationRequest):
    return optimize_function(request, "python")
