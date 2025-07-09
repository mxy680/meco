import type { ChatWithAttachments } from "@/lib/db/chat";

interface ChatMessageProps {
    chat: ChatWithAttachments;
    isUser: boolean;
}

export default function ChatMessage({ chat, isUser }: ChatMessageProps) {
    if (isUser) {
        return (
            <div className="ml-auto max-w-[75%] bg-foreground/5 border border-border shadow-md rounded-xl px-4 py-3 text-right">
                <div className="text-foreground whitespace-pre-line text-sm">{chat.content}</div>
            </div>
        );
    }
    return (
        <div className="text-foreground whitespace-pre-line text-sm mr-auto max-w-[75%]">
            {chat.content}
        </div>
    );
}

