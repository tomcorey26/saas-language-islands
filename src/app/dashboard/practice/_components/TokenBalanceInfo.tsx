"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOKEN_COSTS } from "@/data/tokenCosts";

interface TokenBalanceInfoProps {
  userTokens: number;
  hasEnoughTokens: boolean;
}

export function TokenBalanceInfo({
  userTokens,
  hasEnoughTokens,
}: TokenBalanceInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl mb-6",
        hasEnoughTokens
          ? "bg-purple-50 border border-purple-200"
          : "bg-amber-50 border border-amber-200"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            hasEnoughTokens ? "bg-purple-100" : "bg-amber-100"
          )}
        >
          <Coins
            className={cn(
              "h-5 w-5",
              hasEnoughTokens ? "text-purple-600" : "text-amber-600"
            )}
          />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            Your balance: <span className="font-bold">{userTokens} tokens</span>
          </p>
          <p className="text-sm text-gray-500">
            This conversation costs {TOKEN_COSTS.CONVERSATION} tokens
          </p>
        </div>
      </div>
      {!hasEnoughTokens && (
        <a
          href="/pricing"
          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline"
        >
          Get more tokens
        </a>
      )}
    </motion.div>
  );
}
