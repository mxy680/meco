"use client";

import { useEffect, useMemo, useState } from "react";
import { ChatInput } from "../../ui/chat-input";
import { ChatTextarea } from "./chat-text-area";
import { ChatPlaceholder } from "./chat-placeholder";
import { ChatSuggestions } from "./chat-suggestions";
import { ChatBackground } from "./chat-background";
import { useAutoResizeTextarea } from "./use-auto-resize-text-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/db/profile";
import { getActiveOrganization } from "@/lib/db/organization";
import { createProject } from "@/lib/db/project";
import { createChat } from "@/lib/db/chat";
import { AttachmentInput } from "@/lib/db/chat";

import { useRouter } from "next/navigation";

export function Chat() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);

    // --- Create Project & Chat Handler ---
    const handleCreateProjectAndChat = async () => {
        try {
            // 1. Get the current user from session
            const user = await getCurrentUser();
            if (!user || !user.id) throw new Error("User ID not found in user response");

            // 2. Get the user's active organization
            const org = await getActiveOrganization();
            if (!org || !org.id) throw new Error("Active organization not found in response");

            // 3. Create project
            const projectName = "Untitled Project";
            const project = await createProject({
                name: projectName,
                organizationId: org.id,
                userId: user.id,
            });
            if (!project || !project.id) throw new Error("Failed to create project");

            // Redirect to the new chat page for this project
            router.push(`/projects/${project.id}`);

            // 4. Create chat for the project (with attachments)
            const chat = await createChat(
                {
                    projectId: project.id,
                    userId: user.id,
                    content: value,
                },
                attachments // Pass attachments array
            );
            if (!chat || !chat.id) throw new Error("Failed to create chat");
            // Optionally, handle chat response here
            // Do not clear value or attachments before redirecting
        } catch (err) {
            // Optionally, show error to user
            console.error(err);
        }
    };


    // Animated cycling placeholder logic
    const examplePrompts = useMemo(() => [
        "Train a regression model on my dataset of house prices...",
        "Classify images of handwritten digits...",
        "Cluster customers by purchasing behavior...",
        "Segment objects in satellite images...",
        "Predict stock prices using historical data..."
    ], []);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [placeholder, setPlaceholder] = useState(examplePrompts[0]);

    useEffect(() => {
        if (value) return;
        const interval = setInterval(() => {
            setPlaceholderIndex((i) => (i + 1) % examplePrompts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [value, examplePrompts.length]);

    useEffect(() => {
        setPlaceholder(examplePrompts[placeholderIndex]);
    }, [placeholderIndex, examplePrompts]);


    // Removed unused commandSuggestions array
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
        }
    };

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-6 relative overflow-hidden">
            <ChatBackground />
            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div
                    className="relative z-10 space-y-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <h1 className="text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                                How can I help today?
                            </h1>
                            <motion.div
                                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p
                            className="text-sm text-white/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Generate a machine learning pipeline start-to-finish.
                        </motion.p>
                    </div>

                    <motion.div
                        className="relative backdrop-blur-2xl bg-background/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="p-4">
                            <div className="relative w-full">
                                <ChatTextarea
                                    ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                                    value={value}
                                    onChange={e => {
                                        setValue(e.target.value);
                                        adjustHeight();
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                    containerClassName="w-full"
                                    className={cn(
                                        "w-full px-4 py-3",
                                        "resize-none",
                                        "bg-transparent",
                                        "border-none",
                                        "text-white/90 text-sm",
                                        "focus:outline-none",
                                        "min-h-[60px]"
                                    )}
                                    style={{ overflow: "hidden" }}
                                    showRing={false}
                                />
                                <ChatPlaceholder value={value} placeholder={placeholder} />
                            </div>
                        </div>
                        <ChatInput
                            value={value}
                            setValue={setValue}
                            attachments={attachments}
                            setAttachments={setAttachments}
                            onSend={handleCreateProjectAndChat}
                            inputFocused={inputFocused}
                            setInputFocused={setInputFocused}
                            textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                            adjustHeight={adjustHeight}
                        />

                    </motion.div>

                    <ChatSuggestions />
                </motion.div>
            </div>

            {inputFocused && (
                <motion.div
                    className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
                    animate={{
                        x: mousePosition.x - 400,
                        y: mousePosition.y - 400,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 150,
                        mass: 0.5,
                    }}
                />
            )}
        </div>
    );
}