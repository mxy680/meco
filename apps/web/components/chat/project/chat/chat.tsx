
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChatBox } from "./chat-box";
import ChatMessage from "./chat-message";
import Typewriter from "./typewriter";
import DotsTypewriter from "./dots-typewriter";
import { getChats } from "@/lib/db/chat";
import { generateOpenAIResponse } from "@/lib/llm/openai";

// Import Chat type from db/chat or define it here if not exported
import type { Chat, Attachment } from "@prisma/client";
import type { ChatWithAttachments } from "@/lib/db/chat";


export default function Chat() {
    const params = useParams();
    const projectId = params.projectid as string;
    const [chats, setChats] = useState<ChatWithAttachments[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [llmLoading, setLlmLoading] = useState(false);
    const [llmResponse, setLlmResponse] = useState<string>("");
    const [llmError, setLlmError] = useState<string | null>(null);

    // Helper: always available
    function hasAttachments(obj: unknown): obj is { attachments: Attachment[] } {
        return (
            typeof obj === 'object' &&
            obj !== null &&
            Array.isArray((obj as { attachments?: unknown }).attachments)
        );
    }
    const toChatWithAttachments = useCallback((chat: Chat): ChatWithAttachments => {
        if (hasAttachments(chat)) {
            return { ...chat, attachments: chat.attachments };
        }
        return { ...chat, attachments: [] };
    }, []);

    useEffect(() => {
        if (!projectId) return;
        setLoading(true);
        getChats(projectId)
            .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
            .catch((e) => setError(e.message || "Failed to fetch chats"))
            .finally(() => setLoading(false));
    }, [projectId, toChatWithAttachments]);

    // Call LLM if last message is user and not already loading
    useEffect(() => {
        if (
            !loading &&
            !llmLoading &&
            chats.length > 0 &&
            chats[chats.length - 1].role === "user" &&
            !llmResponse &&
            !llmError
        ) {
            setLlmLoading(true);
            setLlmResponse("");
            setLlmError(null);
            generateOpenAIResponse(
                chats.map((c) => ({ role: c.role as "user" | "assistant", content: c.content }))
            )
                .then(async (msg) => {
                    if (msg?.content && projectId) {
                        setLlmResponse(msg.content);
                        // Save assistant message to DB
                        try {
                            const { createChat } = await import("@/lib/db/chat");
                            await createChat({
                                projectId,
                                userId: null,
                                content: msg.content,
                                role: "assistant",
                            });
                            // Refresh chat list
                            setLoading(true);
                            getChats(projectId)
                                .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
                                .catch((e) => setError(e.message || "Failed to fetch chats"))
                                .finally(() => setLoading(false));
                        } catch {
                            setLlmError("Failed to save assistant message");
                        }
                    }
                })
                .catch((e) => setLlmError(e.message || "Failed to generate response"))
                .finally(() => setLlmLoading(false));
        }
    }, [chats, loading, llmLoading, llmResponse, llmError, projectId, toChatWithAttachments]);

    return (
        <div className="w-[40%] h-[calc(100vh-4rem)] flex flex-col px-4 pt-4 pb-0">
            <div className="grow basis-[80%] min-h-0 overflow-y-auto pb-4">
                {loading && <div className="text-muted-foreground text-sm">Loading chats...</div>}
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {!loading && !error && chats.length === 0 && (
                    <div className="text-muted-foreground text-sm">No chats yet.</div>
                )}
                {!loading && !error && chats.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {chats.map((chat) => {
                            const isUser = chat.role === "user";
                            return (
                                <ChatMessage key={chat.id} chat={chat} isUser={isUser} />
                            );
                        })}
                        {/* If last message is from user, show LLM loading or response */}
                        {chats[chats.length - 1]?.role === "user" && (
                            llmLoading ? (
                                <div className="text-foreground whitespace-pre-line text-sm mr-auto max-w-[75%] flex items-center gap-1">
                                    <Typewriter text="Orca is thinking" />
                                    <DotsTypewriter />
                                </div>
                            ) : llmError ? (
                                <div className="text-red-500 whitespace-pre-line text-sm mr-auto max-w-[75%]">{llmError}</div>
                            ) : llmResponse ? (
                                <div className="text-foreground whitespace-pre-line text-sm mr-auto max-w-[75%]">
                                    <Typewriter text={llmResponse} />
                                </div>
                            ) : null
                        )}
                    </div>
                )}
            </div>
            <div className="basis-[20%] flex flex-col justify-end">
                <ChatBox />
            </div>
        </div>
    );
}
