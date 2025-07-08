import { cn } from "@/lib/utils";
import * as React from "react";

interface TokenUsageProps {
  tokensUsed: number;
  totalTokens: number;
  className?: string;
}

export function TokenUsage({
  tokensUsed,
  totalTokens,
  className,
}: TokenUsageProps) {
  const percentageUsed = Math.round((tokensUsed / totalTokens) * 100);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <div className="relative w-20 h-20">
        {/* Circular background */}
        <div className="absolute inset-0 rounded-full bg-gray-100 border border-gray-200"></div>

        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="44"
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary transition-all duration-300 ease-in-out"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="44"
            cx="50"
            cy="50"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${
              2 * Math.PI * 44 * (1 - percentageUsed / 100)
            }`}
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Percentage text in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">{percentageUsed}%</span>
        </div>
      </div>

      <div className="text-xs text-center space-y-1">
        <div className="font-medium text-gray-700">Token Usage</div>
        <div className="text-gray-600 text-center">
          Used: {tokensUsed.toLocaleString()} Left: {totalTokens - tokensUsed}
        </div>
      </div>
    </div>
  );
}
