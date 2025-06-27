import { ModelOption } from "./types";

// Constants
export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const PASTE_THRESHOLD = 200; // characters threshold for showing as pasted content
export const DEFAULT_MODELS_INTERNAL: ModelOption[] = [
    {
        id: "claude-sonnet-4",
        name: "Claude Sonnet 4",
        description: "Balanced model",
        badge: "Latest",
    },
    {
        id: "claude-opus-3.5",
        name: "Claude Opus 3.5",
        description: "Highest intelligence",
    },
    {
        id: "claude-haiku-3",
        name: "Claude Haiku 3",
        description: "Fastest responses",
    },
];