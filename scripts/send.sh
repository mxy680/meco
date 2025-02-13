#!/bin/bash

# Define API URL
API_URL="http://localhost:8000/api/optimize"

# Define JSON payload with sophisticated function
JSON_PAYLOAD=$(cat <<EOF
{
    "function_code": "def matrix_multiply(A, B):\n    if len(A[0]) != len(B):\n        raise ValueError('Number of columns in A must match number of rows in B')\n\n    result = [[0 for _ in range(len(B[0]))] for _ in range(len(A))]\n\n    for i in range(len(A)):\n        for j in range(len(B[0])):\n            for k in range(len(B)):\n                result[i][j] += A[i][k] * B[k][j]\n\n    return result",
    "language": "python",
    "test_cases": [
        {
            "input": "[[1, 2], [3, 4]], [[5, 6], [7, 8]]",
            "expected_output": "[[19, 22], [43, 50]]"
        },
        {
            "input": "[[2, 4], [1, 3]], [[1, 2], [3, 4]]",
            "expected_output": "[[14, 20], [10, 14]]"
        }
    ]
}
EOF
)


# Send POST request with JSON payload
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD"
