
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatBox } from "./chat-box";
import ChatMessage from "./chat-message";
import { getChats } from "@/lib/db/chat";

// Import Chat type from db/chat or define it here if not exported
import type { Chat, Attachment } from "@prisma/client";
import type { ChatWithAttachments } from "@/lib/db/chat";


export default function Chat() {
    const params = useParams();
    const projectId = params.projectid as string;
    const [chats, setChats] = useState<ChatWithAttachments[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        function hasAttachments(obj: unknown): obj is { attachments: Attachment[] } {
            return (
                typeof obj === 'object' &&
                obj !== null &&
                Array.isArray((obj as { attachments?: unknown }).attachments)
            );
        }
        function toChatWithAttachments(chat: Chat): ChatWithAttachments {
            if (hasAttachments(chat)) {
                return { ...chat, attachments: chat.attachments };
            }
            return { ...chat, attachments: [] };
        }
        if (!projectId) return;
        setLoading(true);
        getChats(projectId)
            .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
            .catch((e) => setError(e.message || "Failed to fetch chats"))
            .finally(() => setLoading(false));
    }, [projectId]);

    return (
        <div className="w-[40%] p-4 flex flex-col justify-between h-full">
            <div className="flex-1 overflow-y-auto">
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
                    </div>
                )}
            </div>
            <ChatBox />
        </div>
    );
}
