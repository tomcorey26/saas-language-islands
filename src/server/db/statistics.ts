import { db } from "@/drizzle/db";
import { DeckTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getComprehensiveStats(clerkUserId: string) {
  // Get basic user stats
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.clerkUserId, clerkUserId),
  });

  if (!user) {
    return null;
  }

  // Get all decks with cards
  const decks = await db.query.DeckTable.findMany({
    where: eq(DeckTable.clerkUserId, clerkUserId),
    with: {
      cards: {
        with: {
          island: true,
        },
      },
      islands: true,
    },
  });

  // Calculate total cards and mastery levels
  const allCards = decks.flatMap((deck) => deck.cards);

  const difficultyBreakdown = {
    again: allCards.filter((card) => card.difficulty === "again").length,
    difficult: allCards.filter((card) => card.difficulty === "difficult")
      .length,
    good: allCards.filter((card) => card.difficulty === "good").length,
    easy: allCards.filter((card) => card.difficulty === "easy").length,
  };

  // Calculate cards due for review
  const now = new Date();
  const cardsDueForReview = allCards.filter(
    (card) => card.nextReviewAt && card.nextReviewAt <= now
  ).length;

  // Calculate cards reviewed today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const cardsReviewedToday = allCards.filter(
    (card) =>
      card.lastReviewedAt &&
      card.lastReviewedAt >= todayStart &&
      card.lastReviewedAt <= now
  ).length;

  // Calculate average ease factor
  const cardsWithEaseFactor = allCards.filter(
    (card) => card.easeFactor !== null
  );
  const averageEaseFactor =
    cardsWithEaseFactor.length > 0
      ? cardsWithEaseFactor.reduce(
          (sum, card) => sum + (card.easeFactor || 0),
          0
        ) /
        cardsWithEaseFactor.length /
        100
      : 2.5;

  // Language breakdown
  const languageStats = decks.reduce((acc, deck) => {
    const lang = deck.language;
    if (!acc[lang]) {
      acc[lang] = {
        decks: 0,
        cards: 0,
        mastered: 0,
      };
    }
    acc[lang].decks += 1;
    acc[lang].cards += deck.cards.length;
    acc[lang].mastered += deck.cards.filter(
      (card) => card.difficulty === "easy"
    ).length;
    return acc;
  }, {} as Record<string, { decks: number; cards: number; mastered: number }>);

  // Island statistics
  const islandStats = decks.flatMap((deck) =>
    deck.islands.map((island) => {
      const islandCards = deck.cards.filter(
        (card) => card.islandId === island.id
      );
      return {
        id: island.id,
        name: island.name,
        deckName: deck.name,
        totalCards: islandCards.length,
        masteredCards: islandCards.filter((card) => card.difficulty === "easy")
          .length,
      };
    })
  );

  // Calculate retention rate (cards not marked as "again")
  const retentionRate =
    allCards.length > 0
      ? ((allCards.length - difficultyBreakdown.again) / allCards.length) * 100
      : 0;

  // Calculate learning velocity (cards moved to "good" or "easy" in the last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlyImprovedCards = allCards.filter(
    (card) =>
      (card.difficulty === "good" || card.difficulty === "easy") &&
      card.updatedAt &&
      card.updatedAt >= sevenDaysAgo
  ).length;

  // Get review history for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const reviewHistory: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    reviewHistory[dateStr] = allCards.filter(
      (card) =>
        card.lastReviewedAt &&
        card.lastReviewedAt >= dayStart &&
        card.lastReviewedAt <= dayEnd
    ).length;
  }

  // Calculate deck performance
  const deckPerformance = decks.map((deck) => ({
    id: deck.id,
    name: deck.name,
    language: deck.language,
    totalCards: deck.cards.length,
    masteredCards: deck.cards.filter((card) => card.difficulty === "easy")
      .length,
    dueCards: deck.cards.filter(
      (card) => card.nextReviewAt && card.nextReviewAt <= now
    ).length,
    averageEaseFactor:
      deck.cards.filter((card) => card.easeFactor !== null).length > 0
        ? deck.cards
            .filter((card) => card.easeFactor !== null)
            .reduce((sum, card) => sum + (card.easeFactor || 0), 0) /
          deck.cards.filter((card) => card.easeFactor !== null).length /
          100
        : 2.5,
  }));

  return {
    user: {
      tokensBalance: user.tokensBalance,
      memberSince: user.createdAt,
    },
    overview: {
      totalDecks: decks.length,
      totalCards: allCards.length,
      totalIslands: islandStats.length,
      cardsDueForReview,
      cardsReviewedToday,
      retentionRate,
      averageEaseFactor,
    },
    difficultyBreakdown,
    languageStats,
    islandStats,
    deckPerformance,
    reviewHistory,
    learningVelocity: {
      last7Days: recentlyImprovedCards,
      averagePerDay: recentlyImprovedCards / 7,
    },
  };
}

// Get daily review streak
export async function getReviewStreak(clerkUserId: string) {
  const decks = await db.query.DeckTable.findMany({
    where: eq(DeckTable.clerkUserId, clerkUserId),
    with: {
      cards: true,
    },
  });

  const allCards = decks.flatMap((deck) => deck.cards);

  // Sort cards by last reviewed date
  const reviewedCards = allCards
    .filter((card) => card.lastReviewedAt)
    .sort((a, b) => {
      const dateA = a.lastReviewedAt!.getTime();
      const dateB = b.lastReviewedAt!.getTime();
      return dateB - dateA;
    });

  if (reviewedCards.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastReviewDate: null };
  }

  // Calculate current streak
  let currentStreak = 0;
  const checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  while (true) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate);
    dayEnd.setHours(23, 59, 59, 999);

    const reviewedOnDay = reviewedCards.some(
      (card) =>
        card.lastReviewedAt! >= dayStart && card.lastReviewedAt! <= dayEnd
    );

    if (reviewedOnDay) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check if it's today and we haven't reviewed yet
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkDate.getTime() === today.getTime() && currentStreak > 0) {
        // We have a streak going but haven't reviewed today yet
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // For now, longest streak equals current streak
  // In a production app, you'd track this separately
  const longestStreak = currentStreak;

  return {
    currentStreak,
    longestStreak,
    lastReviewDate: reviewedCards[0]?.lastReviewedAt || null,
  };
}
