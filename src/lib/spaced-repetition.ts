import { CardDifficulty } from "@/data/cardDifficulties";

// SM-2 Algorithm Implementation
interface SpacedRepetitionCard {
  easeFactor: number;
  repetitions: number;
  lastReviewedAt: Date | null;
}

interface SpacedRepetitionResult {
  nextReviewAt: Date;
  easeFactor: number;
  repetitions: number;
}

export function calculateNextReview(
  difficulty: CardDifficulty,
  card?: Partial<SpacedRepetitionCard>
): SpacedRepetitionResult {
  const easeFactor = card?.easeFactor || 2.5;
  const repetitions = card?.repetitions || 0;
  
  let newEaseFactor = easeFactor;
  let newRepetitions = repetitions;
  let intervalDays = 1;

  switch (difficulty) {
    case "again":
      // Reset repetitions and reduce ease factor
      newRepetitions = 0;
      newEaseFactor = Math.max(1.3, easeFactor - 0.2);
      intervalDays = 1;
      break;
    case "difficult":
      // Slightly reduce ease factor and increase repetitions
      newRepetitions = repetitions + 1;
      newEaseFactor = Math.max(1.3, easeFactor - 0.15);
      if (newRepetitions === 1) {
        intervalDays = 1;
      } else if (newRepetitions === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round((repetitions - 1) * newEaseFactor);
      }
      break;
    case "good":
      // Maintain ease factor and increase repetitions normally
      newRepetitions = repetitions + 1;
      if (newRepetitions === 1) {
        intervalDays = 1;
      } else if (newRepetitions === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round((repetitions - 1) * newEaseFactor);
      }
      break;
    case "easy":
      // Increase ease factor and repetitions
      newRepetitions = repetitions + 1;
      newEaseFactor = Math.min(3.0, easeFactor + 0.15);
      if (newRepetitions === 1) {
        intervalDays = 4;
      } else if (newRepetitions === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round((repetitions - 1) * newEaseFactor);
      }
      break;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    nextReviewAt,
    easeFactor: Math.round(newEaseFactor * 100) / 100, // Round to 2 decimal places
    repetitions: newRepetitions,
  };
}

// Memory technique prompt generators
export function getMemoryPalacePrompts(): string[] {
  return [
    "Where in your home would you place this phrase? (e.g., kitchen counter, bedroom door, bathroom mirror)",
    "What familiar location reminds you of this phrase? (e.g., your workplace, favorite restaurant, childhood home)",
    "Which room or area feels connected to the meaning of this phrase?",
    "Where would you physically write or post this phrase in your daily environment?",
    "What location do you visit regularly that could help you remember this phrase?",
  ];
}

export function getVisualImageryPrompts(): string[] {
  return [
    "Create a vivid, unusual mental image for this phrase. What do you see?",
    "If this phrase were a cartoon character, what would it look like?",
    "What colors, shapes, or objects come to mind when you think of this phrase?",
    "Imagine this phrase as a scene from a movie. Describe what happens.",
    "What's the most ridiculous or funny way you could visualize this phrase?",
    "If you had to draw this phrase, what would be the key visual elements?",
  ];
}

export function getPersonalConnectionPrompts(): string[] {
  return [
    "Does this phrase remind you of someone you know? Who and why?",
    "What personal experience or memory does this phrase connect to?",
    "How might you use this phrase in your own life or relationships?",
    "What emotion or feeling does this phrase evoke for you?",
    "Does this phrase relate to any of your hobbies, interests, or goals?",
    "What situation from your past would this phrase have been useful in?",
  ];
}

export function getRandomPrompt(prompts: string[]): string {
  return prompts[Math.floor(Math.random() * prompts.length)];
}
