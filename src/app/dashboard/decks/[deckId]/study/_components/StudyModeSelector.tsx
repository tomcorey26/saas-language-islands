import { ModeCard } from "./ModeCard";

interface StudyModeSelectorProps {
  deckId: string;
  cardCount: number;
}

export function StudyModeSelector({
  deckId,
  cardCount,
}: StudyModeSelectorProps) {
  const modes = [
    {
      href: `/dashboard/decks/${deckId}/study/standard`,
      iconName: "BookOpen" as const,
      title: "Standard Study",
      description: "Traditional flashcard practice with spaced repetition",
      colorClass: "from-blue-500 to-blue-600",
    },
    {
      href: `/dashboard/decks/${deckId}/study/conversation`,
      iconName: "MessageCircle" as const,
      title: "Conversational Study",
      description: "Practice with AI-powered conversations in context",
      colorClass: "from-purple-500 to-purple-600",
    },
    {
      href: `/dashboard/decks/${deckId}/study/listening`,
      iconName: "Headphones" as const,
      title: "Listening Practice",
      description: "Improve comprehension with audio-focused exercises",
      colorClass: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Card count info */}
      <div className="text-center">
        <p className="text-muted-foreground">
          {cardCount} {cardCount === 1 ? "card" : "cards"} ready to practice
        </p>
      </div>

      {/* Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modes.map((mode, index) => (
          <ModeCard key={mode.title} {...mode} index={index} />
        ))}
      </div>
    </div>
  );
}
