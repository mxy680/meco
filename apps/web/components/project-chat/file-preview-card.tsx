import { FileWithPreview } from "./chat";
import { isTextualFile, getFileTypeLabel, formatFileSize } from "@/lib/utils/chat";
import TextualFilePreviewCard from "./textual-file-preview-card";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// File Preview Component
const FilePreviewCard: React.FC<{
    file: FileWithPreview;
    onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
    const isImage = file.type.startsWith("image/");
    const isTextual = isTextualFile(file.file);

    // If it's a textual file, use the TextualFilePreviewCard
    if (isTextual) {
        return <TextualFilePreviewCard file={file} onRemove={onRemove} />;
    }

    return (
        <div
            className={cn(
                "relative group bg-background border w-fit border-white/20 rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden",
                isImage ? "p-0" : "p-3"
            )}
        >
            <div className="flex items-start gap-3 size-[125px] overflow-hidden">
                {isImage && file.preview ? (
                    <div className="relative size-full rounded-md overflow-hidden bg-background">
                        <Image
                            src={file.preview || "/placeholder.svg"}
                            alt={file.file.name}
                            fill
                            className="w-full h-full object-cover"
                            sizes="125px"
                            unoptimized={file.preview?.startsWith('blob:')}
                        />
                    </div>
                ) : (
                    <></>
                )}
                {!isImage && (
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
                                <p className="absolute bottom-2 left-2 capitalize text-white text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
                                    {getFileTypeLabel(file.type)}
                                </p>
                            </div>
                            {file.uploadStatus === "uploading" && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                            )}
                            {file.uploadStatus === "error" && (
                                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                            )}
                        </div>

                        <p
                            className="max-w-[90%] text-xs font-medium text-white truncate"
                            title={file.file.name}
                        >
                            {file.file.name}
                        </p>
                        <p className="text-[10px] text-zinc-200 mt-1">
                            {formatFileSize(file.file.size)}
                        </p>
                    </div>
                )}
            </div>
            <Button
                size="icon"
                variant="outline"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => onRemove(file.id)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default FilePreviewCard;