"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/project-chat/chat";
import Notebook from "@/components/project-notebook/notebook";

export default function ChatProjectPage() {

    const params = useParams();
    const projectId = params.projectid as string;
    console.log(projectId);
    return (
        <div className="flex w-full min-h-[60vh]">
            {/* Left Side (40%) */}
            <Chat />
            
            {/* Right Side (60%) */}
            <Notebook />
        </div>
    );
}

