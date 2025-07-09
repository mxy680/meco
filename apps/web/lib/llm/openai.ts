/**
 * Generate a response using the Orca system prompt for ML automation and code execution.
 * @param messages Array of messages (role: "user" | "assistant", content: string)
 * @returns The generated response message from the LLM
 */
export async function generateOpenAIResponse(messages: { role: "user" | "assistant", content: string }[]) {
    const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Failed to generate response");
    }
    const data = await res.json();
    return data.message;
}

