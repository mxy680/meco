"use client";
import { useParams } from "next/navigation";

export default function ChatProjectPage() {
    const params = useParams();
    const projectId = params.projectid as string;

    console.log(projectId);

    return (
        <div className="flex flex-col md:flex-row w-full h-screen gap-4 p-4">
            {/* Chatbot Section */}
            <section className="w-full md:w-2/5 bg-neutral-900 rounded-xl p-0 flex flex-col shadow-md min-h-0 h-full overflow-hidden relative">
                {/* Animated header and placeholder */}
                <div className="text-center pt-8 pb-4 space-y-3">
                    <h1 className="text-2xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                        Project Chat
                    </h1>
                    <p className="text-sm text-white/40">
                        Generate a machine learning pipeline start-to-finish.
                    </p>
                </div>
                {/* Chat area */}
                <div className="flex-1 flex flex-col justify-end">
                    {/* ChatTextarea and ChatInput mimic */}
                    {/* For now, only input UI, not chat history */}
                    <div className="relative w-full px-4 pb-4">
                        <textarea
                            className="w-full px-4 py-3 resize-none bg-transparent border-none text-white/90 text-sm focus:outline-none min-h-[60px] rounded-xl backdrop-blur-xl border border-white/[0.05]"
                            placeholder="Type your message..."
                            rows={1}
                        />
                        {/* Placeholder cycling logic could be added here if needed */}
                    </div>
                    <div className="w-full px-4 pb-6">
                        <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/80 text-neutral-900 shadow-lg shadow-white/10 flex items-center gap-2 w-full justify-center">
                            Send
                        </button>
                    </div>
                </div>
                {/* Animated background effect */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]" />
            </section>
            {/* Jupyter Notebook Section */}
            <section className="w-full md:w-3/5 bg-neutral-800 rounded-xl p-4 flex flex-col shadow-md min-h-0 h-full">
                <h2 className="text-lg font-semibold mb-2">Jupyter Notebook</h2>
                <div className="flex-1 flex items-center justify-center text-white/40 min-h-0">
                    {/* Notebook UI goes here */}
                    <span className="italic">Notebook section placeholder</span>
                </div>
            </section>
        </div>
    );
}