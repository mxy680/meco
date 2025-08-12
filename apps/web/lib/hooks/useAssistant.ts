import { useRef, useEffect, useState, useCallback } from "react";
import { getChats, createChat } from "@/lib/db/chat";
import { generateOpenAIResponse } from "@/lib/completions/openai";
import type { Chat } from "@prisma/client";
import type { ChatWithAttachments } from "@/lib/db/chat";

/**
 * Custom React hook to manage chat state, LLM streaming, and error/loading state for a project chat.
 * Handles fetching chat history, triggering LLM responses, streaming assistant output, and persisting assistant messages.
 */
export function useLLMAssistant(projectId: string | undefined) {
  // State for chat messages, loading/error, and LLM streaming
  const [chats, setChats] = useState<ChatWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [llmError, setLlmError] = useState<string | null>(null);

  // Helper to ensure all chats have an attachments array
  const toChatWithAttachments = useCallback(
    (chat: Chat): ChatWithAttachments => ({
      ...chat,
      attachments: (chat as ChatWithAttachments).attachments ?? [],
    }),
    []
  );

  // Fetch chats when projectId changes
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    getChats(projectId)
      .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
      .catch((e) => setError(e.message || "Failed to fetch chats"))
      .finally(() => setLoading(false));
  }, [projectId, toChatWithAttachments]);

  // Ref to track the last user message ID to avoid duplicate LLM calls
  const lastUserMessageIdRef = useRef<string | null>(null);

  // When a new user message is detected, stream LLM response and persist it
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

        (async () => {
          try {
            console.log("[LLM stream] Starting streaming for user message:", chats[chats.length - 1]);
            let fullResponse = "";
            await generateOpenAIResponse(
              chats.map((c) => ({ role: c.role as "user" | "assistant", content: c.content })),
              (token: string) => {
                console.log("[LLM stream] Token:", token);
                fullResponse += token;
                setLlmResponse((prev) => prev + token);
              }
            );
            console.log("[LLM stream] Streaming complete. Full response:", fullResponse);
            if (fullResponse && projectId) {
              try {
                await createChat({
                  projectId,
                  userId: null,
                  content: fullResponse,
                  role: "assistant",
                });
                setLoading(true);
                getChats(projectId)
                  .then((chats: Chat[]) => setChats(chats.map(toChatWithAttachments)))
                  .catch((e) => setError(e.message || "Failed to fetch chats"))
                  .finally(() => setLoading(false));
              } catch {
                setLlmError("Failed to save assistant message");
              }
            }
          } catch (e: unknown) {
            console.error("[LLM stream] Error during streaming:", e);
            setLlmError(e instanceof Error ? e.message : "Failed to generate response");
          } finally {
            setLlmLoading(false);
          }
        })();
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