import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Project } from "./navbar";

function ProjectMenuPopoverContent() {
    return (
        <PopoverContent>
            
        </PopoverContent>
    );
}

export default function ProjectMenuSection({ project }: { project: Project | null }) {
    return (
        <div className="flex items-center gap-3">
            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer select-none">
                        <div
                            className={
                                `w-6 h-6 rounded-sm flex items-center justify-center ` +
                                (project?.color
                                    ? (project.color.startsWith('#')
                                        ? ''
                                        : `bg-${project.color}`) // tailwind class
                                    : 'bg-gradient-to-br from-orange-500 to-red-500')
                            }
                            style={project?.color && project.color.startsWith('#') ? { background: project.color } : undefined}
                        >
                            <div className="w-3 h-3 bg-white rounded-sm opacity-90"></div>
                        </div>
                        <span className="px-1 py-0.5 text-gray-200 hover:text-gray-300 text-sm font-medium rounded flex items-center gap-1">
                            {project?.name || "Untitled Project"}
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                    </div>
                </PopoverTrigger>
                <ProjectMenuPopoverContent />
            </Popover>
        </div>
    );
}