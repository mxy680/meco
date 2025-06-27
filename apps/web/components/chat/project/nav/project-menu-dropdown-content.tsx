import { Pencil, Settings, Palette, HelpCircle, LogOut } from "lucide-react";

export default function ProjectMenuDropdownContent() {
    return (
        <>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer">
                <Pencil className="h-3 w-3 mr-2 opacity-80 text-gray-200 group-hover:text-gray-300 transition-colors" />
                <span className="flex-1 text-sm text-gray-200 transition-colors group-hover:text-gray-300">Rename</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer">
                <Settings className="h-3 w-3 mr-2 opacity-80 text-gray-200 group-hover:text-gray-300 transition-colors" />
                <span className="flex-1 text-sm text-gray-200 transition-colors group-hover:text-gray-300">Settings</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer">
                <Palette className="h-3 w-3 mr-2 opacity-80 text-gray-200 group-hover:text-gray-300 transition-colors" />
                <span className="flex-1 text-sm text-gray-200 transition-colors group-hover:text-gray-300">Appearance</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer">
                <HelpCircle className="h-3 w-3 mr-2 opacity-80 text-gray-200 group-hover:text-gray-300 transition-colors" />
                <span className="flex-1 text-sm text-gray-200 transition-colors group-hover:text-gray-300">Help</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer">
                <LogOut className="h-3 w-3 mr-2 opacity-80 text-gray-200 group-hover:text-gray-300 transition-colors" />
                <span className="flex-1 text-sm text-gray-200 transition-colors group-hover:text-gray-300">Go to Dashboard</span>
            </div>
        </>
    );
}