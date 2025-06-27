import { FileWithPreview } from "./types";
import { getFileExtension } from "./utils";
import { Loader2, X, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Textual File Preview Component
const TextualFilePreviewCard: React.FC<{
    file: FileWithPreview;
    onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
    const isExpanded = false;
    const previewText = file.textContent?.slice(0, 150) || "";
    const needsTruncation = (file.textContent?.length || 0) > 150;
    const fileExtension = getFileExtension(file.file.name);

    return (
        <div className="bg-white/10 border border-white/20 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden">
            <div className="text-[8px] text-zinc-300 whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar">
                {file.textContent ? (
                    <>
                        {isExpanded || !needsTruncation ? file.textContent : previewText}
                        {!isExpanded && needsTruncation && "..."}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                )}
            </div>
            {/* OVERLAY */}
            <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
                <p className="capitalize text-white text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
                    {fileExtension}
                </p>
                {/* Upload status indicator */}
                {file.uploadStatus === "uploading" && (
                    <div className="absolute top-2 left-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                    </div>
                )}
                {file.uploadStatus === "error" && (
                    <div className="absolute top-2 left-2">
                        <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    </div>
                )}
                {/* Actions */}
                <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
                    {file.textContent && (
                        <Button
                            size="icon"
                            variant="outline"
                            className="size-6"
                            onClick={() =>
                                navigator.clipboard.writeText(file.textContent || "")
                            }
                            title="Copy content"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="outline"
                        className="size-6"
                        onClick={() => onRemove(file.id)}
                        title="Remove file"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TextualFilePreviewCard;
