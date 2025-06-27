export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
};

export const getFileTypeLabel = (type: string): string => {
    const parts = type.split("/");
    let label = parts[parts.length - 1].toUpperCase();
    if (label.length > 7 && label.includes("-")) {
        // e.g. VND.OPENXMLFORMATS-OFFICEDOCUMENT...
        label = label.substring(0, label.indexOf("-"));
    }
    if (label.length > 10) {
        label = label.substring(0, 10) + "...";
    }
    return label;
};

// Helper function to check if a file is textual
export const isTextualFile = (file: File): boolean => {
    const textualTypes = [
        "text/",
        "application/json",
        "application/xml",
        "application/javascript",
        "application/typescript",
    ];

    const textualExtensions = [
        "txt",
        "md",
        "py",
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "htm",
        "css",
        "scss",
        "sass",
        "json",
        "xml",
        "yaml",
        "yml",
        "csv",
        "sql",
        "sh",
        "bash",
        "php",
        "rb",
        "go",
        "java",
        "c",
        "cpp",
        "h",
        "hpp",
        "cs",
        "rs",
        "swift",
        "kt",
        "scala",
        "r",
        "vue",
        "svelte",
        "astro",
        "config",
        "conf",
        "ini",
        "toml",
        "log",
        "gitignore",
        "dockerfile",
        "makefile",
        "readme",
    ];

    // Check MIME type
    const isTextualMimeType = textualTypes.some((type) =>
        file.type.toLowerCase().startsWith(type)
    );

    // Check file extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const isTextualExtension =
        textualExtensions.includes(extension) ||
        file.name.toLowerCase().includes("readme") ||
        file.name.toLowerCase().includes("dockerfile") ||
        file.name.toLowerCase().includes("makefile");

    return isTextualMimeType || isTextualExtension;
};

// Helper function to read file content as text
export const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

// Helper function to get file extension for badge
export const getFileExtension = (filename: string): string => {
    const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
    return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
};