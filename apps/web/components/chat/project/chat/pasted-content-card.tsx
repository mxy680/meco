import { PastedContent } from "./types";
import { Button } from "@/components/ui/button";
import { X, Copy } from "lucide-react";

// Pasted Content Preview Component
const PastedContentCard: React.FC<{
    content: PastedContent;
    onRemove: (id: string) => void;
}> = ({ content, onRemove }) => {
    const isExpanded = false;
    const previewText = content.content.slice(0, 150);
    const needsTruncation = content.content.length > 150;

    return (
        <div className="bg-white/10 border border-white/20 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden">
            <div className="text-[8px] text-zinc-300 whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar">
                {isExpanded || !needsTruncation ? content.content : previewText}
                {!isExpanded && needsTruncation && "..."}
            </div>
            {/* OVERLAY */}
            <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
                <p className="capitalize text-white text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
                    PASTED
                </p>
                {/* Actions */}
                <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className="size-6"
                        onClick={() => navigator.clipboard.writeText(content.content)}
                        title="Copy content"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="size-6"
                        onClick={() => onRemove(content.id)}
                        title="Remove content"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PastedContentCard;
