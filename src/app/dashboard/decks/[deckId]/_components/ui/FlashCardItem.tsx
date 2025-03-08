"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashCard } from "@/zod/models/flashcard.model";
import { motion } from "framer-motion";
import { Volume2, MoreVertical } from "lucide-react";

interface FlashCardItemProps {
  card: FlashCard;
  index: number;
}

export function FlashCardItem({ card, index }: FlashCardItemProps) {
  const playAudio = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(card.translation);
      utterance.lang = "es-ES"; // Set language to Spanish
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-3">
        <div className="flex flex-col">
          <p className="text-sm text-gray-600">{card.phrase}</p>
          <p className="text-base font-bold">{card.translation}</p>
          <div className="flex justify-between mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
