"use client";

import DevConsoleNavbar from "@/components/chat/project/nav/navbar";
import { motion } from "framer-motion";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen w-screen bg-background">
            <DevConsoleNavbar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-1"
            >
                {children}
            </motion.div>
        </div>
    );
}
