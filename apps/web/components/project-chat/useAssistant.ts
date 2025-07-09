import { useRef, useEffect, useState, useCallback } from "react";
import { getChats, createChat } from "@/lib/db/chat";
import { generateOpenAIResponse } from "@/lib/completions/openai";
import type { Chat, Attachment } from "@prisma/client";
import type { ChatWithAttachments } from "@/lib/db/chat";

export function useLLMAssistant(projectId: string | undefined) {
  const [chats, setChats] = useState<ChatWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [llmError, setLlmError] = useState<string | null>(null);

  function hasAttachments(obj: unknown): obj is { attachments: Attachment[] } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      Array.isArray((obj as { attachments?: unknown }).attachments)
    );
  }
  const toChatWithAttachments = useCallback((chat: Chat): ChatWithAttachments => {
    if (hasAttachments(chat)) {
      return { ...chat, attachments: chat.attachments };
    }
    return { ...chat, attachments: [] };
  }, []);

  // Fetch chats on projectId change
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    getChats(projectId)
      .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
      .catch((e) => setError(e.message || "Failed to fetch chats"))
      .finally(() => setLoading(false));
  }, [projectId, toChatWithAttachments]);

  // Only call LLM for a new user message
  const lastUserMessageIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!loading && chats.length > 0 && projectId) {
      const last = chats[chats.length - 1];
      if (
        last.role === "user" &&
        last.id !== lastUserMessageIdRef.current &&
        !llmLoading
      ) {
        lastUserMessageIdRef.current = last.id;
        setLlmLoading(true);
        setLlmResponse("");
        setLlmError(null);
        generateOpenAIResponse(
          chats.map((c) => ({ role: c.role as "user" | "assistant", content: c.content }))
        )
          .then(async (msg) => {
            if (msg?.content && projectId) {
              setLlmResponse(msg.content);
              // Save assistant message to DB
              try {
                await createChat({
                  projectId,
                  userId: null,
                  content: msg.content,
                  role: "assistant",
                });
                // Refresh chat list
                setLoading(true);
                getChats(projectId)
                  .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
                  .catch((e) => setError(e.message || "Failed to fetch chats"))
                  .finally(() => setLoading(false));
              } catch {
                setLlmError("Failed to save assistant message");
              }
            }
          })
          .catch((e) => setLlmError(e.message || "Failed to generate response"))
          .finally(() => setLlmLoading(false));
      }
    }
  }, [loading, chats, projectId, toChatWithAttachments, llmLoading]);

  return {
    chats,
    loading,
    error,
    llmLoading,
    llmResponse,
    llmError,
    setChats,
    setLlmResponse,
    setLlmError,
    setLoading,
    setError,
    toChatWithAttachments,
  };
}
