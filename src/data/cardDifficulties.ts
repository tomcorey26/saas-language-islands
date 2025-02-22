export const cardDifficulties = {
  again: "again",
  difficult: "difficult",
  good: "good",
  easy: "easy",
} as const;

export type CardDifficulty = keyof typeof cardDifficulties;

export const cardDifficultiesInOrder = [
  cardDifficulties.again,
  cardDifficulties.difficult,
  cardDifficulties.good,
  cardDifficulties.easy,
] as const;
