"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Paperclip, SendIcon, XIcon, HelpCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsDialog from "@/components/settings/settings-dialog";
import { AttachmentInput } from "@/lib/db/chat";

interface ChatInputProps {
  value: string;
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
  onSend: () => void;
}

export function ChatInput({
  value,
  attachments,
  setAttachments,
  onSend
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
      <div className="p-4 border-t border-foreground/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* File attachment button */}
          <motion.button
            type="button"
            onClick={handleAttachClick}
            whileTap={{ scale: 0.94 }}
            className="p-2 rounded-lg transition-colors relative group"
            aria-label="Attach files"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
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
                "p-2 rounded-lg transition-colors relative group"
              )}
            >
              <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
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
              "p-2 rounded-lg transition-colors relative group"
            )}
            aria-label="Open documentation"
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </motion.button>
        </div>
        <motion.button
          type="button"
          onClick={onSend}
          {...(value.trim() ? { whileHover: { scale: 1.02 } } : {})}
          whileTap={{ scale: 0.98 }}
          disabled={!value.trim()}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            "flex items-center gap-2",
            "border border-zinc-200 dark:border-zinc-700",
            value.trim()
              ? "dark:bg-foreground/10 text-background shadow-md"
              : "text-muted-foreground bg-background/[0.05] dark:bg-white/10"
          )}
        >
          <motion.span
            initial={false}
            animate={{ color: value.trim() ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2"
          >
            <SendIcon className="w-4 h-4" />
            <motion.span
              initial={false}
              animate={{ color: value.trim() ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              transition={{ duration: 0.22 }}
            >
              Send
            </motion.span>
          </motion.span>
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
                className="group flex items-center gap-1 text-xs bg-foreground/2.5 py-1.5 px-3 rounded-lg text-foreground"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span className="transition-colors text-foreground">{file.name}</span>
                <button
                  onClick={() => handleRemoveAttachment(index)}
                  className="ml-1 p-0 bg-transparent border-none shadow-none rounded-none text-muted-foreground transition-colors group-hover:text-foreground disabled:text-muted-foreground disabled:opacity-60"
                  aria-label={`Remove attachment ${file.name}`}
                >
                  <XIcon className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
