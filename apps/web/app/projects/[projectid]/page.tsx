"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/chat/project/chat/chat";

export default function ChatProjectPage() {

    const params = useParams();
    const projectId = params.projectid as string;
    console.log(projectId);
    return (
        <div className="flex w-full min-h-[60vh]">
            {/* Left Side (40%) */}
            <Chat />
            
            {/* Right Side (60%) */}
            <div className="w-[60%] p-4 border-l border-foreground/10 rounded-l-xl">
                {/* Right content here */}
            </div>
        </div>
    );
}

