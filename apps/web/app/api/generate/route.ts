import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json()
        const { signature, description, testCases, model } = body

        // Validate the request data
        if (!signature || !description || !testCases || !model) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const payload = {
            "signature": signature,
            "description": description,
            "test_cases": testCases,
            "models": [model],
            "language": "python"
        }

        // Call the API
        const response = await fetch('http://localhost:8000/api/optimize/function', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        // Extract JSON from the response
        const result = await response.json()

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error generating function:', error)
        return NextResponse.json(
            { error: 'Failed to generate function' },
            { status: 500 }
        )
    }
}
