import { Search, Slash, Code2, Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActionsSection() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200"
                >
                    <Search className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200"
                >
                    <Slash className="h-4 w-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-gray-700 mx-1"></div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200"
                >
                    <Code2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200"
                >
                    <Zap className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200"
                >
                    <Github className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2 ml-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 px-3 h-8 transition-colors duration-150 hover:bg-white/10 hover:text-gray-100"
                >
                    Invite
                </Button>
                <Button
                    size="sm"
                    className="bg-blue-600 text-white px-4 h-8 transition duration-150 hover:bg-blue-700 hover:brightness-105 hover:shadow-md"
                >
                    Publish
                </Button>
            </div>
        </div>
    );
}