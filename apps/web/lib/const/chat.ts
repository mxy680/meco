import { ModelOption } from "@/lib/types/chat";

// Constants
export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const PASTE_THRESHOLD = 200; // characters threshold for showing as pasted content
export const DEFAULT_MODELS_INTERNAL: ModelOption[] = [
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Anthropic's balanced model",
    badge: "Anthropic",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description: "OpenAI's flagship model (omni)",
    badge: "OpenAI",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Google's advanced model",
    badge: "Google",
  },
  {
    id: "llama-4",
    name: "Llama 4",
    description: "Meta's open model",
    badge: "Meta",
  },
];