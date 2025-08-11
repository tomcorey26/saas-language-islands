"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Star, TrendingUp } from "lucide-react";

interface DeckPerformanceProps {
  decks: Array<{
    id: string;
    name: string;
    language: string;
    totalCards: number;
    masteredCards: number;
    dueCards: number;
    averageEaseFactor: number;
  }>;
}

export function DeckPerformance({ decks }: DeckPerformanceProps) {
  const getPerformanceColor = (easeFactor: number) => {
    if (easeFactor >= 2.5) return "text-green-600 bg-green-100";
    if (easeFactor >= 2.0) return "text-blue-600 bg-blue-100";
    if (easeFactor >= 1.5) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getPerformanceLabel = (easeFactor: number) => {
    if (easeFactor >= 2.5) return "Excellent";
    if (easeFactor >= 2.0) return "Good";
    if (easeFactor >= 1.5) return "Fair";
    return "Needs Work";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Deck Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {decks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No decks created yet
          </p>
        ) : (
          <div className="space-y-4">
            {decks.map((deck) => {
              const masteryRate = deck.totalCards > 0 
                ? (deck.masteredCards / deck.totalCards) * 100 
                : 0;
              
              return (
                <div 
                  key={deck.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{deck.name}</h4>
                        <p className="text-sm text-muted-foreground">{deck.language}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(deck.averageEaseFactor)}`}>
                        {getPerformanceLabel(deck.averageEaseFactor)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Mastery Progress</span>
                        <span className="font-medium">{masteryRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={masteryRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{deck.totalCards}</p>
                          <p className="text-xs text-muted-foreground">Total Cards</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="font-medium">{deck.masteredCards}</p>
                          <p className="text-xs text-muted-foreground">Mastered</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">{deck.dueCards}</p>
                          <p className="text-xs text-muted-foreground">Due</p>
                        </div>
                      </div>
                    </div>
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