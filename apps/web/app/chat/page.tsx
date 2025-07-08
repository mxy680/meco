"use client";

import { Chat } from "@/components/chat/landing/landing-chat";

export default function ChatPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <Chat />
            </div>
        </div>
    );
}
