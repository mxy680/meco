
"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
    Plus,
    SlidersHorizontal,
    ArrowUp,
    ImageIcon,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_FILES, MAX_FILE_SIZE, DEFAULT_MODELS_INTERNAL, PASTE_THRESHOLD } from "./const";
import { ChatInputProps, FileWithPreview, PastedContent } from "./types";
import { readFileAsText, isTextualFile, formatFileSize } from "./utils";
import ModelSelectorDropdown from "./model-selector-dropdown";
import PastedContentCard from "./pasted-content-card";
import FilePreviewCard from "./file-preview-card";

// Main ChatInput Component
export const ChatBox: React.FC<ChatInputProps> = ({
    onSendMessage,
    disabled = false,
    placeholder = "How can I help you today?",
    maxFiles = MAX_FILES,
    maxFileSize = MAX_FILE_SIZE,
    acceptedFileTypes,
    models = DEFAULT_MODELS_INTERNAL,
    defaultModel,
    onModelChange,
}) => {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedModel, setSelectedModel] = useState(
        defaultModel || models[0]?.id || ""
    );

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const maxHeight =
                Number.parseInt(getComputedStyle(textareaRef.current).maxHeight, 10) ||
                120;
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                maxHeight
            )}px`;
        }
    }, [message]);

    const handleFileSelect = useCallback(
        (selectedFiles: FileList | null) => {
            if (!selectedFiles) return;

            const currentFileCount = files.length;
            if (currentFileCount >= maxFiles) {
                alert(
                    `Maximum ${maxFiles} files allowed. Please remove some files to add new ones.`
                );
                return;
            }

            const availableSlots = maxFiles - currentFileCount;
            const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);

            if (selectedFiles.length > availableSlots) {
                alert(
                    `You can only add ${availableSlots} more file(s). ${selectedFiles.length - availableSlots
                    } file(s) were not added.`
                );
            }

            const newFiles = filesToAdd
                .filter((file) => {
                    if (file.size > maxFileSize) {
                        alert(
                            `File ${file.name} (${formatFileSize(
                                file.size
                            )}) exceeds size limit of ${formatFileSize(maxFileSize)}.`
                        );
                        return false;
                    }
                    if (
                        acceptedFileTypes &&
                        !acceptedFileTypes.some(
                            (type) =>
                                file.type.includes(type) || type === file.name.split(".").pop()
                        )
                    ) {
                        alert(
                            `File type for ${file.name
                            } not supported. Accepted types: ${acceptedFileTypes.join(", ")}`
                        );
                        return false;
                    }
                    return true;
                })
                .map((file) => ({
                    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(),
                    file,
                    preview: file.type.startsWith("image/")
                        ? URL.createObjectURL(file)
                        : undefined,
                    type: file.type || "application/octet-stream",
                    uploadStatus: "pending" as const,
                    uploadProgress: 0,
                }));

            setFiles((prev) => [...prev, ...newFiles as FileWithPreview[]]);

            newFiles.forEach((fileToUpload) => {
                // Read text content for textual files
                if (isTextualFile(fileToUpload.file)) {
                    readFileAsText(fileToUpload.file)
                        .then((textContent) => {
                            setFiles((prev) =>
                                prev.map((f) =>
                                    f.id === fileToUpload.id ? { ...f, textContent } : f
                                )
                            );
                        })
                        .catch((error) => {
                            console.error("Error reading file content:", error);
                            setFiles((prev) =>
                                prev.map((f) =>
                                    f.id === fileToUpload.id
                                        ? { ...f, textContent: "Error reading file content" }
                                        : f
                                )
                            );
                        });
                }

                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileToUpload.id ? { ...f, uploadStatus: "uploading" } : f
                    )
                );

                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20 + 5; // Simulate faster upload
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === fileToUpload.id
                                    ? { ...f, uploadStatus: "complete", uploadProgress: 100 }
                                    : f
                            )
                        );
                    } else {
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === fileToUpload.id
                                    ? { ...f, uploadProgress: progress }
                                    : f
                            )
                        );
                    }
                }, 150); // Faster interval
            });
        },
        [files.length, maxFiles, maxFileSize, acceptedFileTypes]
    );

    const removeFile = useCallback((id: string) => {
        setFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === id);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            // TODO: Abort upload if in progress using fileToRemove.abortController
            return prev.filter((f) => f.id !== id);
        });
    }, []);

    const removePastedContent = useCallback((id: string) => {
        setPastedContent((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
            const clipboardData = e.clipboardData;
            const items = clipboardData.items;

            const fileItems = Array.from(items).filter(
                (item) => item.kind === "file"
            );
            if (fileItems.length > 0 && files.length < maxFiles) {
                e.preventDefault();
                const pastedFiles = fileItems
                    .map((item) => item.getAsFile())
                    .filter(Boolean) as File[];
                const dataTransfer = new DataTransfer();
                pastedFiles.forEach((file) => dataTransfer.items.add(file));
                handleFileSelect(dataTransfer.files);
                return;
            }

            const textData = clipboardData.getData("text");
            if (
                textData &&
                textData.length > PASTE_THRESHOLD &&
                pastedContent.length < 5
            ) {
                // Limit pasted content items
                e.preventDefault();
                setMessage(message + textData.slice(0, PASTE_THRESHOLD) + "..."); // Add a portion to textarea

                const pastedItem: PastedContent = {
                    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(),
                    content: textData,
                    timestamp: new Date(),
                    wordCount: textData.split(/\s+/).filter(Boolean).length,
                };

                setPastedContent((prev) => [...prev, pastedItem]);
            }
        },
        [handleFileSelect, files.length, maxFiles, pastedContent.length, message]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);
    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
                handleFileSelect(e.dataTransfer.files);
            }
        },
        [handleFileSelect]
    );

    const handleSend = useCallback(() => {
        if (
            disabled ||
            (!message.trim() && files.length === 0 && pastedContent.length === 0)
        )
            return;
        if (files.some((f) => f.uploadStatus === "uploading")) {
            alert("Please wait for all files to finish uploading.");
            return;
        }

        onSendMessage?.(message, files, pastedContent);

        setMessage("");
        files.forEach((file) => {
            if (file.preview) URL.revokeObjectURL(file.preview);
        });
        setFiles([]);
        setPastedContent([]);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }, [message, files, pastedContent, disabled, onSendMessage]);

    const handleModelChangeInternal = useCallback(
        (modelId: string) => {
            setSelectedModel(modelId);
            onModelChange?.(modelId);
        },
        [onModelChange]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const hasContent =
        message.trim() || files.length > 0 || pastedContent.length > 0;
    const canSend =
        hasContent &&
        !disabled &&
        !files.some((f) => f.uploadStatus === "uploading");

    return (
        <div
            className="relative w-full max-w-2xl mx-auto"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-background border-2 border-dashed border-blue-500 rounded-xl flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-sm text-blue-500 flex items-center gap-2">
                        <ImageIcon className="size-4 opacity-50" />
                        Drop files here to add to chat
                    </p>
                </div>
            )}

            <div className="bg-foreground/5 backdrop-blur-md border border-border rounded-xl shadow-lg items-end gap-2 min-h-[150px] flex flex-col">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 min-h-[100px] w-full p-4 focus-within:border-none focus:outline-none focus:border-none border-none outline-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:outline-none max-h-[120px] resize-none border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0 placeholder:text-muted-foreground text-sm sm:text-base custom-scrollbar"
                    rows={1}
                />
                <div className="flex items-center gap-2 justify-between w-full px-3 pb-1.5">
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || files.length >= maxFiles}
                            title={
                                files.length >= maxFiles
                                    ? `Max ${maxFiles} files reached`
                                    : "Attach files"
                            }
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0"
                            disabled={disabled}
                            title="Options (Not implemented)"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        {models && models.length > 0 && (
                            <ModelSelectorDropdown
                                models={models}
                                selectedModel={selectedModel}
                                onModelChange={handleModelChangeInternal}
                            />
                        )}

                        <Button
                            size="icon"
                            className={cn(
                                "h-9 w-9 p-0 flex-shrink-0 rounded-md transition-colors",
                                canSend
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-muted text-muted-foreground border-none shadow-none cursor-not-allowed"
                            )}
                            onClick={handleSend}
                            disabled={!canSend}
                            title="Send message"
                        >
                            <ArrowUp className={cn("h-5 w-5", canSend ? "text-white" : "text-muted-foreground")} />
                        </Button>
                    </div>
                </div>
                
                {(files.length > 0 || pastedContent.length > 0) && (
                    <div className="overflow-x-auto bg-muted/70 border border-border rounded-xl shadow-lg p-3 w-full hide-scroll-bar">
                        <div className="flex gap-3">
                            {pastedContent.map((content) => (
                                <PastedContentCard key={content.id} content={content} onRemove={removePastedContent} />
                            ))}
                            {files.map((file) => (
                                <FilePreviewCard key={file.id} file={file} onRemove={removeFile} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/*
                NOTE: Please update ModelSelectorDropdown, FilePreviewCard, and PastedContentCard
                to use theme-adaptive colors and styles as shown here for full consistency.
            */}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept={acceptedFileTypes?.join(",")}
                onChange={(e) => {
                    handleFileSelect(e.target.files);
                    if (e.target) e.target.value = ""; // Reset file input
                }}
            />
        </div>
    );
};
