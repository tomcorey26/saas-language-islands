"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  customPrompt: string;
  status: string;
  totalMessages: number;
  errorCount: number;
  createdAt: string;
}

interface ConversationListProps {
  onStartNew: () => void;
}

export function ConversationList({ onStartNew }: ConversationListProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations(offset = 0) {
    try {
      const res = await fetch(`/api/conversation/list?offset=${offset}`);
      if (res.ok) {
        const data = await res.json();
        if (offset === 0) {
          setConversations(data.conversations);
        } else {
          setConversations((prev) => [...prev, ...data.conversations]);
        }
        setHasMore(data.hasMore);
        setNextOffset(data.nextOffset);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  async function loadMore() {
    if (nextOffset === null || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchConversations(nextOffset);
  }

  function openConversation(conversationId: string) {
    router.push(`/dashboard/practice/${conversationId}`);
  }

  if (isLoading) {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center py-20"
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </motion.div>
    );
  }

  if (conversations.length === 0) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4"
        >
          <MessageCircle className="h-8 w-8 text-purple-600" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold mb-2"
        >
          No conversations yet
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-6 max-w-sm"
        >
          Start practicing a new language with an AI conversation partner!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onStartNew}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Start Your First Chat
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div key="grid">
      <p className="text-sm text-gray-500 mb-4">
        Showing {conversations.length} conversation
        {conversations.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {conversations.map((conv, index) => (
            <motion.button
              key={conv.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 24,
                delay: index < 9 ? index * 0.05 : 0,
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openConversation(conv.id)}
              className="text-left p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    conv.status === "active"
                      ? "bg-green-100 text-green-700"
                      : conv.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                  )}
                >
                  {conv.status.charAt(0).toUpperCase() + conv.status.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(conv.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="font-medium text-gray-900 line-clamp-2 mb-3">
                {conv.customPrompt}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageCircle className="h-4 w-4" />
                {conv.totalMessages} messages
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-8"
        >
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Load more
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
