import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
        });
        return NextResponse.json({ message: completion.choices[0]?.message });
    } catch (error: unknown) {
        console.error("OpenAI completion error", error);
        let message = "Failed to generate completion";
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
