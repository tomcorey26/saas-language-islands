"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { promptSuggestions } from "@/data/conversationPromptSuggestions";
import {
  MessageCircle,
  Loader2,
  ArrowLeft,
  Clock,
  ChevronDown,
} from "lucide-react";
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

interface ConversationPracticeModeProps {
  view: "list" | "new";
  onViewChange: (view: "list" | "new") => void;
}

export function ConversationPracticeMode({
  view,
  onViewChange,
}: ConversationPracticeModeProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isStarting, setIsStarting] = useState(false);

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
    if (!nextOffset || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchConversations(nextOffset);
  }

  async function startConversation() {
    if (!customPrompt.trim() || !targetLanguage) return;

    setIsStarting(true);
    try {
      const response = await fetch("/api/conversation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrompt, targetLanguage }),
      });

      if (response.ok) {
        const { conversationId } = await response.json();
        router.push(`/dashboard/practice/${conversationId}`);
      } else {
        const errorText = await response.text();
        alert(errorText);
        setIsStarting(false);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Failed to start conversation");
      setIsStarting(false);
    }
  }

  function openConversation(conversationId: string) {
    router.push(`/dashboard/practice/${conversationId}`);
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  // ============================================
  // LIST VIEW
  // ============================================
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </motion.div>
          ) : conversations.length === 0 ? (
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
                  onClick={() => onViewChange("new")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Start Your First Chat
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="grid">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {conversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    variants={itemVariants}
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
              </motion.div>

              {/* Load More Button */}
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
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ============================================
  // NEW CONVERSATION VIEW
  // ============================================
  if (view === "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-2xl"
      >
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onViewChange("list")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to conversations
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-6"
        >
          <h2 className="text-xl font-semibold mb-1">New Conversation</h2>
          <p className="text-gray-500">Choose a language and scenario to practice</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          {/* Language Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Mandarin Chinese">Mandarin Chinese</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Scenario Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scenario
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {promptSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.title}
                  type="button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCustomPrompt(suggestion.prompt)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
                    customPrompt === suggestion.prompt
                      ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className="text-2xl">{suggestion.icon}</span>
                  <span className="font-medium text-gray-900">{suggestion.title}</span>
                </motion.button>
              ))}
            </div>
            <motion.textarea
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              placeholder="Or describe your own scenario..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              onClick={startConversation}
              disabled={isStarting || !customPrompt.trim() || !targetLanguage}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Conversation (5 tokens)"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}
