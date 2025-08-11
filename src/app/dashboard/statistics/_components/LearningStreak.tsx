import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flame, Trophy } from "lucide-react";

interface LearningStreakProps {
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastReviewDate: Date | null;
  };
}

export function LearningStreak({ streak }: LearningStreakProps) {
  const formatLastReview = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const streakStatus = streak.currentStreak > 0 
    ? streak.currentStreak >= 7 
      ? "excellent" 
      : streak.currentStreak >= 3 
        ? "good" 
        : "starting"
    : "inactive";

  const streakMessage = {
    excellent: "Amazing streak! Keep it up!",
    good: "Great progress! Stay consistent!",
    starting: "Good start! Build your streak!",
    inactive: "Start reviewing to build a streak!"
  }[streakStatus];

  const streakColor = {
    excellent: "text-orange-600 bg-orange-100",
    good: "text-green-600 bg-green-100",
    starting: "text-blue-600 bg-blue-100",
    inactive: "text-gray-600 bg-gray-100"
  }[streakStatus];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${streakColor}`}>
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <p className="text-3xl font-bold">{streak.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
            <p className="text-sm font-medium">{streakMessage}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{streak.longestStreak}</p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {formatLastReview(streak.lastReviewDate)}
                </p>
                <p className="text-sm text-muted-foreground">Last Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Streak visualization */}
        <div className="mt-6 flex gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const isActive = i < streak.currentStreak;
            return (
              <div
                key={i}
                className={`h-8 flex-1 rounded ${
                  isActive
                    ? i < 7
                      ? "bg-orange-400"
                      : i < 14
                      ? "bg-orange-500"
                      : i < 21
                      ? "bg-orange-600"
                      : "bg-orange-700"
                    : "bg-gray-200"
                }`}
                title={`Day ${30 - i}`}
              />
            );
          }).reverse()}
        </div>
      </CardContent>
    </Card>
  );
}