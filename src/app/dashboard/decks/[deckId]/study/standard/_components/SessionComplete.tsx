"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, Zap, Target, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface SessionCompleteProps {
  totalCards: number;
  correctCount: number;
  xp: number;
  bestStreak: number;
  onBackToDeck: () => void;
  onStudyMore: () => void;
}

export function SessionComplete({
  totalCards,
  correctCount,
  xp,
  bestStreak,
  onBackToDeck,
  onStudyMore,
}: SessionCompleteProps) {
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
            </motion.div>
            <h2 className="text-2xl font-bold">Session Complete!</h2>
            <p className="text-muted-foreground">Great work on your practice</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
              <p className="text-2xl font-bold">{xp}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500 fill-orange-500" />
              <p className="text-2xl font-bold">{bestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <div className="h-6 w-6 mx-auto mb-2 text-green-500 font-bold text-lg">
                {correctCount}/{totalCards}
              </div>
              <p className="text-xs text-muted-foreground">Cards Reviewed</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button onClick={onStudyMore} className="w-full">
              Study More
            </Button>
            <Button onClick={onBackToDeck} variant="outline" className="w-full">
              Back to Deck
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
