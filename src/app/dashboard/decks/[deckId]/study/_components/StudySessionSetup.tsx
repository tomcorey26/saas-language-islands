"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Target, Zap, ArrowRight } from "lucide-react";

interface StudySessionSetupProps {
  stats: {
    totalCards: number;
    newCards: number;
    dueCards: number;
    learningCards: number;
  };
  onStartSession: (cardCount: number) => void;
}

const PRESET_COUNTS = [5, 10, 15, 20, 30];

export function StudySessionSetup({ stats, onStartSession }: StudySessionSetupProps) {
  const [selectedCount, setSelectedCount] = useState(10);
  
  const totalAvailable = stats.newCards + stats.dueCards;
  const maxCards = Math.min(totalAvailable, 50);
  
  const getRecommendedCount = () => {
    if (totalAvailable <= 5) return totalAvailable;
    if (totalAvailable <= 15) return Math.min(10, totalAvailable);
    return 15;
  };

  const recommended = getRecommendedCount();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Ready to Study?</h1>
        <p className="text-muted-foreground">
          Choose how many cards you'd like to review in this session
        </p>
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{stats.newCards}</div>
          <div className="text-sm text-muted-foreground">New</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold">{stats.dueCards}</div>
          <div className="text-sm text-muted-foreground">Due</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.learningCards}</div>
          <div className="text-sm text-muted-foreground">Learning</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{stats.totalCards}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </Card>
      </div>

      {/* Session Size Selection */}
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Session Size</h3>
            {recommended && (
              <Badge variant="secondary" className="text-xs">
                {recommended} recommended
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalAvailable} cards available to study
          </p>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COUNTS.map((count) => {
            const available = count <= totalAvailable;
            const isRecommended = count === recommended;
            
            return (
              <Button
                key={count}
                variant={selectedCount === count ? "default" : "outline"}
                size="sm"
                disabled={!available}
                onClick={() => setSelectedCount(count)}
                className={`relative ${isRecommended ? "ring-2 ring-green-500" : ""}`}
              >
                {count}
                {isRecommended && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom amount:</label>
          <input
            type="range"
            min="1"
            max={maxCards}
            value={selectedCount}
            onChange={(e) => setSelectedCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span className="font-medium">{selectedCount} cards</span>
            <span>{maxCards}</span>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="text-center text-sm text-muted-foreground">
          Estimated time: {Math.ceil(selectedCount * 0.5)} - {Math.ceil(selectedCount * 1)} minutes
        </div>
      </Card>

      {/* Start Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={() => onStartSession(selectedCount)}
          disabled={totalAvailable === 0}
          className="px-8"
        >
          {totalAvailable === 0 ? (
            "No cards to study"
          ) : (
            <>
              Start Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}