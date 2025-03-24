import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Parse the request params using URL
        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')

        // Validate the request data
        if (!jobId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Call the API
        const response = await fetch(`http://localhost:8000/api/query/job?job_id=${jobId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
