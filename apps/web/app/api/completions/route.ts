import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = "nodejs"; // or "edge" if you want edge runtime

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        if (!Array.isArray(messages)) {
            return NextResponse.json({ error: "Missing or invalid messages array" }, { status: 400 });
        }
        const systemPrompt = `
You are Orca, an expert AI assistant for automating machine learning workflows and code execution. 
Your primary goal is to help users build, debug, and deploy ML projects efficiently. 
You orchestrate code execution in Docker containers, manage dependencies, and provide clear, actionable guidance for ML, data science, and devops tasks. 
Always ensure your responses are practical, safe, and production-oriented. 
If code execution is required, explain the steps and highlight any Docker or environment considerations. 
Respond concisely and with expertise.
`;

        // Create a streaming completion
        const stream = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            stream: true,
        });

        // Create a ReadableStream to yield tokens as they arrive
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const token = chunk.choices[0]?.delta?.content || "";
                    if (token) {
                        controller.enqueue(encoder.encode(token));
                    }
                }
                controller.close();
            }
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            }
        });
    } catch (error: unknown) {
        console.error("OpenAI completion error", error);
        let message = "Failed to generate completion";
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}