// Types
export interface FileWithPreview {
    id: string;
    file: File;
    preview?: string;
    type: string;
    uploadStatus: "pending" | "uploading" | "complete" | "error";
    uploadProgress?: number;
    abortController?: AbortController;
    textContent?: string;
}

export interface PastedContent {
    id: string;
    content: string;
    timestamp: Date;
    wordCount: number;
}

export interface ModelOption {
    id: string;
    name: string;
    description: string;
    badge?: string;
}

export interface ChatInputProps {
    onSendMessage?: (
        message: string,
        files: FileWithPreview[],
        pastedContent: PastedContent[]
    ) => void;
    disabled?: boolean;
    placeholder?: string;
    maxFiles?: number;
    maxFileSize?: number; // in bytes
    acceptedFileTypes?: string[];
    models?: ModelOption[];
    defaultModel?: string;
    onModelChange?: (modelId: string) => void;
}
