import { CardDifficulty } from "@/data/cardDifficulties";

const INTERVALS = {
  again: 1, // 1 minute
  difficult: 5, // 5 minutes
  good: 10, // 10 minutes
  easy: 30, // 30 minutes
};

export function calculateNextReview(difficulty: CardDifficulty): Date {
  const minutes = INTERVALS[difficulty];
  const nextReview = new Date();
  nextReview.setMinutes(nextReview.getMinutes() + minutes);
  return nextReview;
}
