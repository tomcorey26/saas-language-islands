export const DEMO_EXAMPLES = [
  "Ordering food at a restaurant",
  "Asking for directions", 
  "Shopping for clothes",
  "Booking a hotel room",
  "Making small talk at work",
] as const;

export type DemoExample = typeof DEMO_EXAMPLES[number];

// Demo configuration constants
export const DEMO_CONFIG = {
  MAX_PROMPT_LENGTH: 100,
  MAX_TOKENS: 500,
} as const;