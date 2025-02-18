#!/bin/bash

# Define API URL
API_URL="http://localhost:8000/api/optimize"

# Define JSON payload with sophisticated function
JSON_PAYLOAD=$(cat <<EOF
{
    "function_code": "def gcd(a, b):\n\tif b == 0:\n\t\treturn a\n\treturn gcd(b, a % b)",
    "language": "python",
    "test_cases": ["5,6"],
    "models": ["codellama"]
}
EOF
)


# Send POST request with JSON payload
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD"
