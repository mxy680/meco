"use client";

import Chat from "@/components/project-chat/chat";
import Notebook from "@/components/project-notebook/notebook";

export default function ChatProjectPage() {

    return (
        <div className="flex w-full min-h-[60vh]">
            {/* Left Side (40%) */}
            <Chat />
            
            {/* Right Side (60%) */}
            <Notebook />
        </div>
    );
}

