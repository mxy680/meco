import { Search, SquareTerminal, Settings, ClockFading, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ActionsSection() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-background hover:text-gray-200"
                >
                    <Search className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-background hover:text-gray-200"
                >
                    <SquareTerminal className="h-4 w-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-background mx-1"></div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-background hover:text-gray-200"
                >
                    <Settings className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-background hover:text-gray-200"
                >
                    <ClockFading className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-whit   e/5 hover:text-gray-200"
                >
                    <GitBranch className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2 ml-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 px-3 h-8 transition-colors duration-150 hover:bg-background hover:text-gray-100"
                >
                    Invite
                </Button>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      "flex items-center gap-2 h-8",
                      "bg-blue-600 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    )}
                  >
                    <span>Publish</span>
                  </motion.button>
            </div>
        </div>
    );
}