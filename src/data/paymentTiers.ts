// Token costs for AI generation
// Note: Payment system has been removed - all users get 10,000 free tokens
// See /docs/stripe-implementation.md for archived payment implementation

export const tokenCosts = {
  flashcardGeneration: 1, // 1 token per flashcard generated
} as const;

// Default token balance for new users
export const DEFAULT_TOKEN_BALANCE = 10000;
