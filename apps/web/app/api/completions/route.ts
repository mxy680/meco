import { NextResponse } from "next/server";
import OpenAI from "openai";
import type {
    ChatCompletionMessageParam,
    ChatCompletionAssistantMessageParam,
    ChatCompletionUserMessageParam,
} from "openai/resources/chat/completions";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = "nodejs"; // or "edge" if you want edge runtime

// Incoming message type from client; may include attachments which we do not send to OpenAI
type IncomingMessage = {
    role: "user" | "assistant";
    content: string;
    attachments?: unknown[];
};

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        if (!Array.isArray(messages)) {
            return NextResponse.json({ error: "Missing or invalid messages array" }, { status: 400 });
        }
        const incoming: IncomingMessage[] = messages as IncomingMessage[];
        // Debug: log any attachments present in incoming messages
        try {
            const attachments = incoming
                .map((m) => m.attachments)
                .filter((a): a is unknown[] => Array.isArray(a) && a.length > 0);
            if (attachments.length > 0) {
                console.log("[Completions API] Received attachments:", attachments);
            }
        } catch { }

        const systemPrompt = `
You are Orca, an expert AI assistant for automating machine learning workflows and code execution. 
Your primary goal is to help users build, debug, and deploy ML projects efficiently. 
You orchestrate code execution in Docker containers, manage dependencies, and provide clear, actionable guidance for ML, data science, and devops tasks. 
Always ensure your responses are practical, safe, and production-oriented. 
If code execution is required, explain the steps and highlight any Docker or environment considerations. 
Respond concisely and with expertise.
`;

        // Strip any non-OpenAI fields (e.g., attachments) and build a typed message array
        const messagesForOpenAI: ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt },
            ...incoming.map((m): ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam =>
                m.role === "user"
                    ? { role: "user", content: m.content }
                    : { role: "assistant", content: m.content }
            ),
        ];

        // Create a non-streaming completion and return full content once
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: messagesForOpenAI
        });

        const content = completion.choices?.[0]?.message?.content ?? "";
        if (!content) {
            return NextResponse.json({ error: "Empty completion from model" }, { status: 502 });
        }

        return new Response(content, {
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