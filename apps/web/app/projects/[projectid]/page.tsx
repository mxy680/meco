"use client";

import { useParams } from "next/navigation";
import { ChatBox } from "@/components/chat/project/chat/chat-box";

export default function ChatProjectPage() {

    const params = useParams();
    const projectId = params.projectid as string;
    console.log(projectId);
    return (
        <div className="flex w-full min-h-[60vh]">
            {/* Left Side (40%) */}
            <div className="w-[40%] p-4 flex flex-col justify-between h-full">
                {/* Left content here */}
                <div className="flex-1"></div>
                <ChatBox />
            </div>
            {/* Right Side (60%) */}
            <div className="w-[60%] p-4 border-l border-foreground/10 rounded-l-xl">
                {/* Right content here */}
            </div>
        </div>
    );
}

