from fastapi import APIRouter
from app.models import OptimizationRequest
from app.controllers.optimization import optimize

router = APIRouter()


@router.post("/optimize/python")
async def optimize(request: OptimizationRequest):
    return optimize(request, "python")
