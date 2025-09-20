"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";

export function LoadingSkeletons() {
  return (
    <div
      className="space-y-4 mt-6 animate-fade-in-up"
      role="status"
      aria-live="polite"
      aria-label="Generating flashcards"
    >
      <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
        <div className="animate-spin">
          <Zap className="size-5 text-yellow-500" />
        </div>
        Generating Your Flashcards...
        <span className="text-2xl animate-pulse">
          ✨
        </span>
      </h3>
      <div className="grid gap-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="p-4 border-2 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 animate-pulse"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}