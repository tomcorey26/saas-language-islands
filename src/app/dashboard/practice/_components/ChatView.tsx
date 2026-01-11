"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StoredMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

interface ChatViewProps {
  conversationId: string;
  customPrompt: string;
  initialMessages: StoredMessage[];
}

export function ChatView({
  conversationId,
  customPrompt,
  initialMessages,
}: ChatViewProps) {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Convert stored messages to UIMessage format for initial state
  const initialUIMessages: UIMessage[] = initialMessages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: "text" as const, text: m.content }],
      createdAt: new Date(m.createdAt),
    }));

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialUIMessages,
    transport: new DefaultChatTransport({
      api: "/api/conversation/chat",
      body: { conversationId },
    }),
  });

  const isStreaming = status === "streaming";

  const getMessageText = (message: UIMessage): string => {
    const textPart = message.parts.find((p) => p.type === "text");
    return textPart && "text" in textPart ? textPart.text : "";
  };

  const isWaitingForResponse =
    status === "submitted" ||
    (isStreaming &&
      messages.length > 0 &&
      messages[messages.length - 1]?.role === "assistant" &&
      !getMessageText(messages[messages.length - 1]));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isStreaming) {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: input }],
      });
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-[calc(100vh-10rem)]"
    >
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 rounded-xl border border-gray-200">
        <div className="px-4 py-6 space-y-4 max-w-3xl mx-auto">
          <AnimatePresence mode="sync">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4"
                >
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Start the conversation
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Send a message to begin practicing with your AI tutor.
                </p>
                <p className="text-sm text-gray-400 mt-4 max-w-md">
                  Scenario: {customPrompt}
                </p>
              </motion.div>
            )}

            {messages.map((message, i) => {
              if (message.role === "system") return null;
              const isUser = message.role === "user";
              const text = getMessageText(message);

              return (
                <motion.div
                  key={message.id || i}
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={cn("flex", isUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                      isUser
                        ? "bg-purple-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
                  </div>
                </motion.div>
              );
            })}

            {isWaitingForResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="shrink-0 pt-4"
      >
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[52px] max-h-[120px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "52px";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="shrink-0 h-[52px] px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
            >
              {isStreaming ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
