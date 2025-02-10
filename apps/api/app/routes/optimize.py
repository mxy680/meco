from fastapi import APIRouter
from app.models import OptimizationRequest

router = APIRouter()


@router.post("/optimize")
async def optimize(request: OptimizationRequest):
    return {"optimized_function": request.function_code}
