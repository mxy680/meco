
import { useParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { ChatBox } from "@/components/project-chat/chat-box";
import ChatMessage from "@/components/project-chat/chat-message";
import Typewriter from "@/components/project-chat/typewriter";
import DotsTypewriter from "@/components/project-chat/dots-typewriter";
import { useLLMAssistant } from "@/components/project-chat/useAssistant";
import { createChat } from "@/lib/db/chat";

// Import Chat type from db/chat or define it here if not exported
import type { Chat } from "@prisma/client";


export default function Chat() {
    const params = useParams();
    const projectId = params.projectid as string;
    const {
        chats,
        loading,
        error,
        llmLoading,
        llmResponse,
        llmError,
        setChats,
    } = useLLMAssistant(projectId);

    // Handler to add a new user message
    const handleSendMessage = async (message: string) => {
        if (!message.trim() || !projectId) return;
        try {
            const chatWithAttachments = await createChat({
                projectId,
                userId: null, // set userId if needed
                content: message,
                role: "user",
            });
            setChats((prev) => [...prev, chatWithAttachments]);
        } catch (e) {
            // Optionally: show error to user
            console.error("Failed to send message", e);
        }
    };

    // 1. Ref for the end of messages
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // 2. Scroll to bottom when chats or LLM state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, llmLoading, llmResponse]);

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
                        {/* Dummy div for auto-scroll */}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <div className="basis-[20%] flex flex-col justify-end">
                <ChatBox onSendMessage={handleSendMessage} disabled={loading || llmLoading} />
            </div>
        </div>
    );
}
