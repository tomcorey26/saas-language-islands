"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Trophy } from "lucide-react";

interface IslandProgressProps {
  islands: Array<{
    id: string;
    name: string;
    deckName: string;
    totalCards: number;
    masteredCards: number;
  }>;
}

export function IslandProgress({ islands }: IslandProgressProps) {
  const sortedIslands = [...islands].sort((a, b) => {
    const aProgress = a.totalCards > 0 ? (a.masteredCards / a.totalCards) : 0;
    const bProgress = b.totalCards > 0 ? (b.masteredCards / b.totalCards) : 0;
    return bProgress - aProgress;
  });

  const topIslands = sortedIslands.slice(0, 10);

  const getIslandIcon = (progress: number) => {
    if (progress === 100) return "🏆";
    if (progress >= 80) return "🌟";
    if (progress >= 60) return "⭐";
    if (progress >= 40) return "🌱";
    if (progress >= 20) return "🌿";
    return "🌾";
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (progress >= 80) return "bg-gradient-to-r from-green-400 to-green-600";
    if (progress >= 60) return "bg-gradient-to-r from-blue-400 to-blue-600";
    if (progress >= 40) return "bg-gradient-to-r from-purple-400 to-purple-600";
    return "bg-gradient-to-r from-gray-400 to-gray-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Island Progress
          </CardTitle>
          {islands.length > 10 && (
            <p className="text-sm text-muted-foreground">
              Showing top 10 of {islands.length} islands
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {topIslands.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No islands created yet
          </p>
        ) : (
          <div className="space-y-3">
            {topIslands.map((island, index) => {
              const progress = island.totalCards > 0 
                ? (island.masteredCards / island.totalCards) * 100 
                : 0;
              
              return (
                <div 
                  key={island.id} 
                  className="group hover:bg-muted/50 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-2xl">
                      {getIslandIcon(progress)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{island.name}</p>
                          <p className="text-xs text-muted-foreground">{island.deckName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{progress.toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">
                            {island.masteredCards}/{island.totalCards}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${getProgressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {progress === 100 && (
                      <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}