import { useRef, useEffect, useState, useCallback } from "react";
import { getChats, createChat, getAttachmentsByChatId } from "@/lib/db/chat";
import { generateOpenAIResponse } from "@/lib/completions/openai";
import type { Chat } from "@prisma/client";
import type { ChatWithAttachments } from "@/lib/db/chat";

/**
 * useLLMAssistant(projectId)
 * --------------------------------------------
 * Purpose:
 *   Centralized state management for the Project Chat experience.
 *   - Fetches chat history for a given project
 *   - Triggers a non-streaming LLM completion when a new user message is detected
 *   - Surfaces UI-friendly loading/error state for both chat fetching and LLM calls
 *   - Persists the assistant's response back to the database and refreshes the chat list
 *
 * Key design choices:
 *   - Non-streaming LLM: we await a single full response and then update UI + persist.
 *   - Duplicate-call guard: we track the last user message ID with a ref to prevent
 *     multiple completions firing for the same message.
 *   - Optimistic UI: new user messages are appended locally, then the LLM response is requested.
 */
export function useLLMAssistant(projectId: string | undefined) {
  // State: chat list for the current project (includes attachments for UI rendering)
  const [chats, setChats] = useState<ChatWithAttachments[]>([]);
  // State: loading/error for initial and subsequent chat fetches
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State: LLM lifecycle (non-streaming)
  const [llmLoading, setLlmLoading] = useState(false); // true while awaiting completion
  const [llmResponse, setLlmResponse] = useState<string>(""); // transient assistant text shown before persistence
  const [llmError, setLlmError] = useState<string | null>(null); // errors from completion or persistence

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
    // Begin loading state for chat list
    setLoading(true);
    getChats(projectId)
      .then(async (rawChats: Chat[]) => {
        // For each chat, fetch attachments by chatId and assemble ChatWithAttachments
        const chatsWithAttachments: ChatWithAttachments[] = await Promise.all(
          rawChats.map(async (c) => {
            try {
              const attachments = await getAttachmentsByChatId(c.id);
              return { ...c, attachments } as ChatWithAttachments;
            } catch (e) {
              console.warn("[Chats] Failed fetching attachments for chat", c.id, e);
              return toChatWithAttachments(c);
            }
          })
        );
        console.log("[Chats] Chats with attachments:", chatsWithAttachments);
        setChats(chatsWithAttachments);
      })
      .catch((e) => setError(e.message || "Failed to fetch chats"))
      .finally(() => setLoading(false));
  }, [projectId, toChatWithAttachments]);

  // Ref to track the last user message ID to avoid duplicate LLM calls
  // We use a ref (not state) so updates don't trigger re-renders.
  const lastUserMessageIdRef = useRef<string | null>(null);

  // LLM trigger: when a new user message appears, request a completion and persist it
  // Notes:
  // - Guards against re-entry using lastUserMessageIdRef and llmLoading
  // - Shows a temporary assistant bubble via llmResponse while awaiting persistence
  useEffect(() => {
    if (!loading && chats.length > 0 && projectId) {
      const last = chats[chats.length - 1];
      if (
        last.role === "user" &&
        last.id !== lastUserMessageIdRef.current &&
        !llmLoading
      ) {
        // Mark this user message as processed to avoid duplicate completions
        lastUserMessageIdRef.current = last.id;
        // Reset LLM state for the new completion
        setLlmLoading(true);
        setLlmResponse("");
        setLlmError(null);

        (async () => {
          try {
            // Request a single, non-streaming completion for the full chat context
            const { content } = await generateOpenAIResponse(
              chats.map((c) => ({
                role: c.role as "user" | "assistant",
                content: c.content,
                attachments: (c as ChatWithAttachments).attachments,
              }))
            );
            // Immediately reflect the assistant output in the UI
            setLlmResponse(content);
            if (content && projectId) {
              try {
                // Persist assistant message to DB, then refresh chat list so the
                // temporary llmResponse can be replaced by the saved message
                await createChat({
                  projectId,
                  userId: null,
                  content,
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
            // Either the completion or the persistence failed
            console.error("[LLM] Error during completion:", e);
            setLlmError(e instanceof Error ? e.message : "Failed to generate response");
          } finally {
            // Clear LLM loading state so the UI can accept the next message
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