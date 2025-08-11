"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StudySessionCompleteProps {
  results: {
    totalReviewed: number;
    correctAnswers: number;
    timeSpent: number;
  };
  deckId: string;
  deckName: string;
  onStartNewSession: () => void;
}

export function StudySessionComplete({
  results,
  deckId,
  deckName,
  onStartNewSession,
}: StudySessionCompleteProps) {
  const accuracy = results.totalReviewed > 0 
    ? Math.round((results.correctAnswers / results.totalReviewed) * 100)
    : 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-500";
    if (accuracy >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getEncouragementMessage = (accuracy: number) => {
    if (accuracy >= 90) return "Excellent work! 🌟";
    if (accuracy >= 70) return "Good job! Keep it up! 👍";
    if (accuracy >= 50) return "Nice effort! You're improving! 📈";
    return "Don't give up! Practice makes perfect! 💪";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Session Complete!</h1>
        <p className="text-muted-foreground">
          Great work studying <span className="font-semibold">{deckName}</span>
        </p>
        <p className="text-lg font-medium text-green-600">
          {getEncouragementMessage(accuracy)}
        </p>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{results.totalReviewed}</div>
          <div className="text-sm text-muted-foreground">Cards Reviewed</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className={`h-6 w-6 ${getAccuracyColor(accuracy)}`} />
          </div>
          <div className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
            {accuracy}%
          </div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
          <div className="text-sm text-muted-foreground">Time Spent</div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Session Breakdown</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Correct answers</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {results.correctAnswers}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Cards that need more practice</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {results.totalReviewed - results.correctAnswers}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Average time per card</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {results.totalReviewed > 0 
                  ? formatTime(Math.round(results.timeSpent / results.totalReviewed))
                  : "0s"
                }
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onStartNewSession}
          className="flex-1"
          size="lg"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Study More Cards
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          asChild
        >
          <Link href={`/dashboard/decks/${deckId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deck
          </Link>
        </Button>
      </div>

      {/* Tips for improvement */}
      {accuracy < 70 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-500">💡</div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">Study Tip</h4>
              <p className="text-sm text-blue-700">
                Try using the memory techniques feature! Click the brain icon on cards 
                to create visual imagery and personal connections that help you remember better.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}