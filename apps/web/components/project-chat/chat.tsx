
import { useParams } from "next/navigation";
import { ChatBox } from "@/components/project-chat/chat-box";
import { useLLMAssistant } from "@/lib/hooks/useAssistant";
import ChatMessage from "@/components/project-chat/chat-message";

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
        setChats((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                projectId,
                userId: null,
                role: "user",
                content: message,
                attachments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    };

    return (
        <div className="w-[40%] h-[calc(100vh-4rem)] flex flex-col px-4 pt-4 pb-0">
            <div className="grow basis-[80%] min-h-0 overflow-y-auto pb-4">
                {loading ? (
                    <div className="text-gray-400 text-center mt-4">Loading chat...</div>
                ) : error ? (
                    <div className="text-red-500 text-center mt-4">{error}</div>
                ) : (
                    <>
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`mb-2 flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <ChatMessage chat={chat} isUser={chat.role === "user"} />
                            </div>
                        ))}
                        {llmLoading && (
                            <div className="mb-2 flex justify-start">
                                <ChatMessage chat={{
                                    id: "streaming-assistant",
                                    projectId: projectId,
                                    userId: null,
                                    role: "assistant",
                                    content: llmResponse || "",
                                    attachments: [],
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                }} isUser={false} />
                                {llmResponse === "" && (
                                    <span className="italic text-gray-400 ml-2">Thinking...</span>
                                )}
                            </div>
                        )}
                        {llmError && (
                            <div className="text-red-500 text-xs text-left px-2">{llmError}</div>
                        )}
                    </>
                )}
            </div>
            <div className="basis-[20%] flex flex-col justify-end">
                <ChatBox onSendMessage={handleSendMessage} disabled={loading || llmLoading} />
            </div>
        </div>
    );
}
