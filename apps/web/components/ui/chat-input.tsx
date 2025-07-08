"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Paperclip, SendIcon, XIcon, HelpCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsDialog from "@/components/settings/settings-dialog";

import type { AttachmentInput } from "../chat/landing/landing-chat";

interface ChatInputProps {
  value: string;
  setValue: (v: string) => void;
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
  onSend: () => void;
  inputFocused: boolean;
  setInputFocused: (v: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  adjustHeight: () => void;
}

export function ChatInput({
  value,
  setValue,
  attachments,
  setAttachments,
  onSend,
  inputFocused,
  setInputFocused,
  textareaRef,
  adjustHeight
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // File attachment
  const handleAttachClick = () => fileInputRef.current?.click();
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([
      ...attachments,
      ...files.map(f => ({
        url: "https://example.com/attachment", // You will populate this after upload
        name: f.name,
        type: f.type,
        size: f.size,
      }))
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  return (
    <>
      <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
        <div className="flex items-center">
          {/* File attachment button */}
          <motion.button
            type="button"
            onClick={handleAttachClick}
            whileTap={{ scale: 0.94 }}
            className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
            aria-label="Attach files"
          >
            <Paperclip className="w-4 h-4" />
          </motion.button>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFilesSelected}
            aria-label="File attachment input"
          />
          <SettingsDialog>
            <motion.button
              type="button"
              tabIndex={-1}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
              )}
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </SettingsDialog>
          <motion.button
            type="button"
            tabIndex={-1}
            onClick={() => {
              window.location.href = '/docs';
            }}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
            )}
            aria-label="Open documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </motion.button>
        </div>
        <motion.button
          type="button"
          onClick={onSend}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={!value.trim()}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            "flex items-center gap-2",
            value.trim()
              ? "bg-background/80 text-neutral-900 shadow-lg shadow-white/10"
              : "bg-background/[0.05] text-white/40"
          )}
        >
          <SendIcon className="w-4 h-4" />
          <span>Send</span>
        </motion.button>
      </div>
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            className="px-4 pb-3 flex gap-2 flex-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-xs bg-background/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveAttachment(index)}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label={`Remove attachment ${file.name}`}
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
