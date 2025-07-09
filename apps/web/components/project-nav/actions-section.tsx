import { Search, SquareTerminal, Settings, ClockFading, GitBranch, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";

export default function ActionsSection() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                >
                    <Search className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                >
                    <SquareTerminal className="h-4 w-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1"></div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                >
                    <Settings className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                >
                    <ClockFading className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                >
                    <GitBranch className="h-4 w-4" />
                </Button>
                {/* Theme Toggle Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground relative"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    aria-label="Toggle theme"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                    <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                </Button>
            </div>

            <div className="flex items-center gap-2 ml-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="px-3 h-8 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
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