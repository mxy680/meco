"use client";

import { Chat } from "@/components/ui/chat";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function ChatPage() {
    return (
        <AuroraBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-3xl">
                    <Chat />
                </div>
            </div>
        </AuroraBackground>
    );
}
