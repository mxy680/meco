from fastapi import APIRouter
from app.models import OptimizationRequest
from optimizer.optimizer import optimize_function
router = APIRouter()


@router.post("/optimize")
async def optimize(request: OptimizationRequest):
    optimize_function(request.function_code, request.language, )
    return {"optimized_function": request.function_code}
