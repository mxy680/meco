"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: "user", text: input },
      { from: "bot", text: "I'm just a demo bot!" },
    ]);
    setInput("");
  }

  return (
    <div className="flex items-center justify-center min-h-svh bg-background">
      <div className="w-full max-w-md border rounded-xl shadow-lg bg-card flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`px-3 py-2 rounded-lg text-sm max-w-[70%] whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSend}
          className="p-4 border-t flex gap-2 bg-background"
        >
          <input
            type="text"
            className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary bg-background"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSend();
              }
            }}
            autoFocus
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
