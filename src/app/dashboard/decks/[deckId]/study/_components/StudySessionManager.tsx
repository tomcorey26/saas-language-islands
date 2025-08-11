"use client";

import { useState } from "react";
import { SupportedLanguageCode } from "@/data/supportedLanguages";
import { StudySessionSetup } from "./StudySessionSetup";
import { StudyMode } from "./StudyMode";
import { StudySessionComplete } from "./StudySessionComplete";
import { getCardsForStudyAction } from "../../actions";
import { FlashCard } from "@/zod/models/flashcard.model";

interface StudySessionManagerProps {
  deckId: string;
  deckName: string;
  deckLanguage: SupportedLanguageCode;
  stats: {
    totalCards: number;
    newCards: number;
    dueCards: number;
    learningCards: number;
  };
}

type SessionState = "setup" | "studying" | "complete";

interface SessionResults {
  totalReviewed: number;
  correctAnswers: number;
  timeSpent: number;
}

export function StudySessionManager({ 
  deckId, 
  deckName, 
  deckLanguage, 
  stats 
}: StudySessionManagerProps) {
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResults>({
    totalReviewed: 0,
    correctAnswers: 0,
    timeSpent: 0,
  });
  const [sessionStartTime, setSessionStartTime] = useState<Date>();

  const handleStartSession = async (cardCount: number) => {
    setSessionStartTime(new Date());
    const studyCards = await getCardsForStudyAction(deckId, cardCount);
    setCards(studyCards);
    setSessionState("studying");
  };

  const handleSessionComplete = (results: Omit<SessionResults, "timeSpent">) => {
    const timeSpent = sessionStartTime 
      ? Math.round((Date.now() - sessionStartTime.getTime()) / 1000)
      : 0;

    setSessionResults({
      ...results,
      timeSpent,
    });
    setSessionState("complete");
  };

  const handleStartNewSession = () => {
    setSessionState("setup");
    setCards([]);
    setSessionResults({ totalReviewed: 0, correctAnswers: 0, timeSpent: 0 });
  };

  const totalAvailable = stats.newCards + stats.dueCards;

  if (totalAvailable === 0) {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">All caught up! 🎉</h2>
        <p className="text-lg text-muted-foreground">
          You don't have any cards to study right now.
        </p>
        <p className="text-sm text-muted-foreground">
          Come back later or add more cards to your deck.
        </p>
        <a
          href={`/dashboard/decks/${deckId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Back to Deck
        </a>
      </div>
    );
  }

  switch (sessionState) {
    case "setup":
      return (
        <StudySessionSetup
          stats={stats}
          onStartSession={handleStartSession}
        />
      );
    
    case "studying":
      return (
        <StudyMode
          cards={cards}
          deckId={deckId}
          deckName={deckName}
          deckLanguage={deckLanguage}
          onSessionComplete={handleSessionComplete}
        />
      );
    
    case "complete":
      return (
        <StudySessionComplete
          results={sessionResults}
          deckId={deckId}
          deckName={deckName}
          onStartNewSession={handleStartNewSession}
        />
      );
    
    default:
      return null;
  }
}