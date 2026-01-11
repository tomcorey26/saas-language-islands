"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ConversationList } from "./ConversationList";
import { NewConversationForm } from "./NewConversationForm";

interface ConversationPracticeModeProps {
  view: "list" | "new";
  onViewChange: (view: "list" | "new") => void;
  userTokens: number;
}

export function ConversationPracticeMode({
  view,
  onViewChange,
  userTokens,
}: ConversationPracticeModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <ConversationList
            key="list"
            onStartNew={() => onViewChange("new")}
          />
        ) : (
          <NewConversationForm
            key="form"
            userTokens={userTokens}
            onBack={() => onViewChange("list")}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
