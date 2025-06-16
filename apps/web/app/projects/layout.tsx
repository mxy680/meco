"use client";

import DevConsoleNavbar from "@/components/chat/project/nav/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuroraBackground>
            <div className="flex flex-col h-screen w-screen">
                <DevConsoleNavbar />
                <div className="flex flex-1">
                    {children}
                </div>
            </div>
        </AuroraBackground>
    );
}
