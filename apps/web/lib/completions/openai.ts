/**
 * Generate a response using the Orca system prompt for ML automation and code execution.
 * @param messages Array of messages (role: "user" | "assistant", content: string)
 * @returns The generated response message from the LLM
 */
export async function generateOpenAIResponse(
    messages: { role: "user" | "assistant", content: string }[],
    onToken?: (token: string) => void
): Promise<{ content: string }> {
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
    if (!res.body) throw new Error("No response body from LLM");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        if (onToken) onToken(chunk);
    }
    return { content: result };
}