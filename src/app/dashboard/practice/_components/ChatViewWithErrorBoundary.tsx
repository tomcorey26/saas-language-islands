"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ChatView } from "./ChatView";
import { ChatErrorFallback } from "./ChatErrorFallback";

interface StoredMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

interface ChatViewWithErrorBoundaryProps {
  conversationId: string;
  customPrompt: string;
  lastAnalyzedMessageId: string | null;
  initialMessages: StoredMessage[];
}

export function ChatViewWithErrorBoundary(props: ChatViewWithErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <ChatErrorFallback error={error} reset={reset} />
      )}
    >
      <ChatView {...props} />
    </ErrorBoundary>
  );
}
