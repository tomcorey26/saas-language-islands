import { cn } from "@/lib/utils";

interface TokenUsageProps {
  availableTokens: number;
  className?: string;
}

export function TokenUsage({ availableTokens, className }: TokenUsageProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[1px]">
        <div className="relative rounded-xl bg-background p-4 backdrop-blur-sm">
          {/* Animated background */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-60" />

          {/* Content */}
          <div className="relative z-10 text-center space-y-2">
            {/* Token icon */}
            <div className="mx-auto w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Token count */}
            <div className="space-y-1">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {availableTokens.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Generations Available
              </div>
            </div>
          </div>

          {/* Subtle animated glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
