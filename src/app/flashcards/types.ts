export type FlashCardViews = "practice" | "edit";

export interface FlashCard {
  id: string;
  sentence: string;
  translation: string;
  isFavorite: boolean;
}
