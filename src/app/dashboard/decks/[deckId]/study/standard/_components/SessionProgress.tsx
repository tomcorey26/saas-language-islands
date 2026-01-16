"use client";

import { Progress } from "@/components/ui/progress";
import { Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionProgressProps {
  current: number;
  total: number;
  streak: number;
  xp: number;
}

export function SessionProgress({
  current,
  total,
  streak,
  xp,
}: SessionProgressProps) {
  const progressPercent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center gap-1 font-medium",
              streak > 0 ? "text-orange-500" : "text-muted-foreground"
            )}
          >
            <Flame
              className={cn("h-4 w-4", streak > 0 && "fill-orange-500")}
            />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-yellow-500">
            <Zap className="h-4 w-4 fill-yellow-500" />
            <span>{xp} XP</span>
          </div>
        </div>
        <span className="text-muted-foreground">
          {current} / {total}
        </span>
      </div>
      <Progress value={progressPercent} className="h-3" />
    </div>
  );
}
