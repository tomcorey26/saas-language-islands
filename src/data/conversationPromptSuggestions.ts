/**
 * Prompt suggestions to help users get started with conversation practice
 * These are just UI suggestions - users can edit or write their own from scratch
 */
export const promptSuggestions = [
  {
    title: "Restaurant Conversation",
    icon: "🍽️",
    prompt:
      "I'm at a restaurant. You are the waiter. Help me practice ordering food and asking about the menu.",
  },
  {
    title: "Airport Check-in",
    icon: "✈️",
    prompt:
      "I'm at the airport. You are the check-in agent. Help me practice checking in for my flight.",
  },
  {
    title: "Hotel Reception",
    icon: "🏨",
    prompt:
      "I'm at a hotel reception. You are the receptionist. Help me practice checking in and asking about amenities.",
  },
  {
    title: "Shopping for Clothes",
    icon: "🛍️",
    prompt:
      "I'm shopping for clothes. You are the shop assistant. Help me practice asking about sizes, prices, and trying items on.",
  },
  {
    title: "Doctor's Appointment",
    icon: "🏥",
    prompt:
      "I'm at the doctor's office. You are the doctor. Help me practice describing my symptoms.",
  },
  {
    title: "Making Friends",
    icon: "👋",
    prompt:
      "I just moved to a new city. You are a friendly local. Help me practice making small talk and getting to know people.",
  },
] as const;
