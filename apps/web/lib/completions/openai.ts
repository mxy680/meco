/**
 * Generate a response using the Orca system prompt for ML automation and code execution.
 * @param messages Array of messages with optional attachments
 * @returns The generated response message from the LLM
 */
export async function generateOpenAIResponse(
    messages: { role: "user" | "assistant", content: string, attachments?: unknown[] }[],
    onToken?: (token: string) => void
): Promise<{ content: string }> {
    // Log attachments (if any) for debugging/inspection
    try {
        const attachmentsOnly = messages.map(m => m.attachments).filter(Boolean);
        if (attachmentsOnly.length > 0) {
            console.log("[LLM] Outgoing attachments:", attachmentsOnly);
        }
    } catch {}
    const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
        // Try to read error as text, fallback to generic
        let errorText = "Failed to generate response";
        try {
            errorText = await res.text();
        } catch {}
        throw new Error(errorText);
    }
    const text = await res.text();
    if (!text) throw new Error("Empty response from LLM");
    if (onToken) onToken(text);
    return { content: text };
}