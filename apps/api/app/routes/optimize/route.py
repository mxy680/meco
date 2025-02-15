from fastapi import APIRouter
from app.models import OptimizationRequest
from optimizer.optimizer import optimize_function
import requests

router = APIRouter()

MODELS = ["codellama", "codegemma"]

SAMPLE_RESPONSE = {
    "codellama": {
        "def matrix_multiply(A, B):\n"
        "    if len(A[0]) != len(B):\n"
        "        raise ValueError('Number of columns in A must match number of rows in B')\n\n"
        "    result = [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]\n\n"
        "    return result"
    },
    "codegemma": {
        "def matrix_multiply(A, B):\n"
        "    from itertools import product\n\n"
        "    if len(A[0]) != len(B):\n"
        "        raise ValueError('Number of columns in A must match number of rows in B')\n\n"
        "    result = [[0] * len(B[0]) for _ in range(len(A))]\n\n"
        "    for i, j in product(range(len(A)), range(len(B[0]))):\n"
        "        result[i][j] = sum(A[i][k] * B[k][j] for k in range(len(B)))\n\n"
        "    return result"
    },
}


@router.post("/optimize")
async def optimize(request: OptimizationRequest):
    # solutions = optimize_function(
    #     request.function_code, request.language, MODELS, stream=True
    # )
    # run_code_in_docker(request.function_code, request.language, request.test_cases)
    # Call the endpoint
    response = requests.post(
        "http://localhost:9000/api/python/run",
        json={
            "function_code": request.function_code,
            "language": "python",
            "test_cases": request.test_cases,
        },
    )
    return {"optimized_function": request.function_code}
