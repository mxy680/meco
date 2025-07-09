import { Pencil, Settings, Palette, HelpCircle, LogOut } from "lucide-react";

export default function ProjectMenuDropdownContent() {
    return (
        <>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition-colors hover:bg-muted cursor-pointer">
                <Pencil className="h-3 w-3 mr-2 opacity-80 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">Rename</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition-colors hover:bg-muted cursor-pointer">
                <Settings className="h-3 w-3 mr-2 opacity-80 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">Settings</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition-colors hover:bg-muted cursor-pointer">
                <Palette className="h-3 w-3 mr-2 opacity-80 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">Appearance</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition-colors hover:bg-muted cursor-pointer">
                <HelpCircle className="h-3 w-3 mr-2 opacity-80 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">Help</span>
            </div>
            <div className="font-medium px-4 py-2 flex items-center gap-3 group rounded-md transition-colors hover:bg-muted cursor-pointer">
                <LogOut className="h-3 w-3 mr-2 opacity-80 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">Go to Dashboard</span>
            </div>
        </>
    );
}