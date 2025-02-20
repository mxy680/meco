#!/bin/bash

# Define API URL
API_URL="http://localhost:8000/api/optimize"

# Define JSON payload for highly unoptimized Fibonacci function (Naïve Recursion)
JSON_PAYLOAD_UNOPTIMIZED=$(cat <<EOF
{
    "function_code": "def fibonacci(n):\\n    if n <= 1:\\n        return n\\n    return fibonacci(n - 1) + fibonacci(n - 2)",
    "language": "python",
    "test_cases": {
        "0": 0,
        "1": 1,
        "5": 5,
        "10": 55,
        "15": 610
    },
    "models": ["codellama"]
}
EOF
)

# Define JSON payload for the most optimal Fibonacci function (Memoization)
JSON_PAYLOAD_OPTIMIZED=$(cat <<EOF
{
    "function_code": "def fibonacci(n, memo={}):\\n    if n in memo:\\n        return memo[n]\\n    if n <= 1:\\n        return n\\n    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)\\n    return memo[n]",
    "language": "python",
    "test_cases": {
        "0": 0,
        "1": 1,
        "5": 5,
        "10": 55,
        "15": 610
    },
    "models": ["codellama"]
}
EOF
)

# Send POST request for unoptimized function
echo "Sending request for unoptimized function..."
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD_UNOPTIMIZED"

echo -e "\n"

# Send POST request for optimized function
echo "Sending request for optimized function..."
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD_OPTIMIZED"

echo "Requests sent."
