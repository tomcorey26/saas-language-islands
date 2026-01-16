/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality ratings:
 * - again (q=0): Complete blackout, reset interval
 * - difficult (q=2): Correct but with difficulty
 * - good (q=3): Correct with some hesitation
 * - easy (q=4): Perfect recall
 */

export type ReviewQuality = "again" | "difficult" | "good" | "easy";

export interface SpacedRepetitionData {
  nextReviewDate: Date;
  interval: number; // in days
  easeFactor: number; // stored as integer (e.g., 250 = 2.5)
  reviewCount: number;
}

interface CardState {
  interval: number;
  easeFactor: number;
  reviewCount: number;
}

const MIN_EASE_FACTOR = 130; // 1.3
const DEFAULT_EASE_FACTOR = 250; // 2.5
const EASY_BONUS = 1.3;

/**
 * Calculate the next review data using SM-2 algorithm
 */
export function calculateNextReview(
  quality: ReviewQuality,
  currentState: CardState
): SpacedRepetitionData {
  const { interval, easeFactor, reviewCount } = currentState;

  let newInterval: number;
  let newEaseFactor = easeFactor;
  let newReviewCount = reviewCount;

  switch (quality) {
    case "again":
      // Reset: interval = 1 day, decrease ease
      newInterval = 1;
      newEaseFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 20);
      // Don't increment review count on failure
      break;

    case "difficult":
      // Small increase, decrease ease
      if (reviewCount === 0) {
        newInterval = 1;
      } else {
        // Multiply by 1.2 instead of full ease factor
        newInterval = Math.max(1, Math.round(interval * 1.2));
      }
      newEaseFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 15);
      newReviewCount = reviewCount + 1;
      break;

    case "good":
      // Standard progression using ease factor
      if (reviewCount === 0) {
        newInterval = 1;
      } else if (reviewCount === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * (easeFactor / 100));
      }
      // Ease factor stays the same for "good"
      newReviewCount = reviewCount + 1;
      break;

    case "easy":
      // Larger increase, increase ease
      if (reviewCount === 0) {
        newInterval = 4;
      } else if (reviewCount === 1) {
        newInterval = 10;
      } else {
        newInterval = Math.round(interval * (easeFactor / 100) * EASY_BONUS);
      }
      newEaseFactor = easeFactor + 15;
      newReviewCount = reviewCount + 1;
      break;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  // Set to start of day for consistency
  nextReviewDate.setHours(0, 0, 0, 0);

  return {
    nextReviewDate,
    interval: newInterval,
    easeFactor: newEaseFactor,
    reviewCount: newReviewCount,
  };
}

/**
 * Get default state for a new card
 */
export function getDefaultCardState(): CardState {
  return {
    interval: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    reviewCount: 0,
  };
}

/**
 * Check if a card is due for review
 */
export function isCardDue(nextReviewDate: Date | null): boolean {
  if (nextReviewDate === null) return true; // New card
  return new Date() >= nextReviewDate;
}

/**
 * Calculate how overdue a card is (in days, negative means not yet due)
 */
export function getOverdueDays(nextReviewDate: Date | null): number {
  if (nextReviewDate === null) return Infinity; // New cards are most overdue
  const now = new Date();
  const diff = now.getTime() - nextReviewDate.getTime();
  return diff / (1000 * 60 * 60 * 24);
}
