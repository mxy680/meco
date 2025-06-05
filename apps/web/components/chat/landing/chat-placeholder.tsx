"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPlaceholderProps {
  value: string;
  placeholder: string;
}

export function ChatPlaceholder({ value, placeholder }: ChatPlaceholderProps) {
  return (
    <AnimatePresence initial={false}>
      {!value && (
        <motion.span
          key={placeholder}
          className="absolute left-4 top-3 select-none pointer-events-none text-white/20 text-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {placeholder}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
