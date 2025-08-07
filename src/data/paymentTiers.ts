/* 

1. Hobby Tier
Access: Limited access to a few basic “islands” with beginner-level sentences.
Features: Core sentence drills, limited daily practice, and basic spaced repetition.
Goal: Offer a taste of the app’s value to hook new users.

2. Pro Tier
Monthly Price: $20
Access: Unlocks more islands with essential conversation themes.
Features:
Access to intermediate sentence packs and cultural insights.
Enhanced spaced repetition for better retention.
Offline mode for practicing on the go.
Goal: Provide a budget-friendly option for casual learners.

3. Polyglot Tier
Monthly Price: $40
Access: Full access to all islands, including advanced and niche conversation themes.
Features:
AI-powered custom sentence generation for specific scenarios.
Pronunciation feedback with voice recognition.
Access to local slang and region-specific sentences.
Customizable daily practice reminders.
Goal: Ideal for users serious about reaching fluency with immersive features.

*/

import { env } from "process";

// Buying tokens to unlock more island generations?

export type TierNames = keyof typeof paymentTiers;
export type PaidTierNames = Exclude<TierNames, "Free">;

export const paymentTiers = {
  Free: {
    name: "Free",
    priceInCents: 0,
    generationCount: 100,
    icon: "",
    stripePriceId: undefined,
  },
  Starter: {
    name: "500 Generations",
    priceInCents: 199, // $1.99
    generationCount: 500,
    stripePriceId: env.STRIPE_STARTER_PLAN_STRIPE_PRICE_ID,
    icon: "🌱",
  },
  Pro: {
    name: "2000 Generations",
    priceInCents: 599, // $5.99
    generationCount: 2000,
    stripePriceId: env.STRIPE_PRO_PLAN_STRIPE_PRICE_ID,
    icon: "🌴",
  },
  Premium: {
    name: "5000 Generations",
    priceInCents: 1299, // $12.99
    generationCount: 5000,
    stripePriceId: env.STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID,
    icon: "🏝️",
  },
} as const;

export const subscriptionTiersInOrder = [
  paymentTiers.Free,
  paymentTiers.Starter,
  paymentTiers.Pro,
  paymentTiers.Premium,
] as const;

export function getPaymentTierByPriceId(priceId: string) {
  return Object.values(paymentTiers).find(
    (tier) => tier.stripePriceId === priceId
  );
}

// ORIGINAL PLAN:
// name: "Free",
// priceInCents: 0,
// tokensBalance: 100,
// canAccessAdvancedSentencePacks: false,
// maxNumberOfLanguages: Infinity, // just one language
// canSaveFlashcards: false,
// canAccessCommunityFlashCards: false,
// canAccessMemorizationPractice: false,
// canDownloadAudio: false,
// canAccessAdvancedSpacedRepetition: false,
// canAccessOfflineMode: false,
// canAccessCustomSentenceGeneration: false,
// canAccessPronunciationFeedback: false,
// canAccessLocalSlang: false,
// canAccessCustomPracticeReminders: false,
// canAccessPersonalizedLearningPaths: false,
// canAccessSpecialIslands: false,
// canAccessPrioritySupport: false,
