/* 

1. Free Tier
Access: Limited access to a few basic “islands” with beginner-level sentences.
Features: Core sentence drills, limited daily practice, and basic spaced repetition.
Goal: Offer a taste of the app’s value to hook new users.

2. Basic Tier
Monthly Price: $5–$10
Access: Unlocks more islands with essential conversation themes.
Features:
Access to intermediate sentence packs and cultural insights.
Enhanced spaced repetition for better retention.
Offline mode for practicing on the go.
Goal: Provide a budget-friendly option for casual learners.

3. Pro Tier
Monthly Price: $10–$20
Access: Full access to all islands, including advanced and niche conversation themes.
Features:
AI-powered custom sentence generation for specific scenarios.
Pronunciation feedback with voice recognition.
Access to local slang and region-specific sentences.
Customizable daily practice reminders.
Goal: Ideal for users serious about reaching fluency with immersive features.

4. Premium Plus (Yearly Subscription)
Annual Price: $80–$120
Access: Everything in Pro, plus exclusive content and early access to new features.
Features:
Personalized learning paths and insights based on progress.
Access to special “islands” like business language or travel-specific phrases.
Priority support and language coaching tips.
Invite-only language partner community for conversation practice.
Goal: Provides an annual option with a slight discount and premium perks for long-term commitment.
*/

// Buying tokens to unlock more island generations?

export const subscriptionTiers = {
  Free: {
    name: "Free",
    priceInCents: 0,
    maxNumberOfGenerationsPerMonth: 50,
    // canAccessAdvancedSentencePacks: false,
    maxNumberOfLanguages: 1, // just one language
    canSaveFlashcards: false,
    canAccessCommunityFlashCards: false,
    canAccessMemorizationPractice: true,
    canDownloadAudio: false,
    // canAccessAdvancedSpacedRepetition: false,
    // canAccessOfflineMode: false,
    // canAccessCustomSentenceGeneration: false,
    // canAccessPronunciationFeedback: false,
    // canAccessLocalSlang: false,
    // canAccessCustomPracticeReminders: false,
    // canAccessPersonalizedLearningPaths: false,
    // canAccessSpecialIslands: false,
    // canAccessPrioritySupport: false,
  },
  Starter: {
    name: "Starter",
    priceInCents: 199,
    maxNumberOfGenerationsPerMonth: 500,
    maxNumberOfLanguages: 3,
    canSaveFlashcards: true,
    canAccessCommunityFlashCards: false,
    canAccessMemorizationPractice: true,
    canDownloadAudio: false,
    // canAccessAdvancedSentencePacks: false,
    // canAccessAdvancedSpacedRepetition: false,
    // canAccessOfflineMode: true,
    // canAccessCustomSentenceGeneration: false,
    // canAccessPronunciationFeedback: false,
    // canAccessLocalSlang: false,
    // canAccessCustomPracticeReminders: false,
    // canAccessPersonalizedLearningPaths: false,
    // canAccessSpecialIslands: false,
    // canAccessPrioritySupport: false,
    // canAccessCommunityFlashCards: false,
  },
  Pro: {
    name: "Pro",
    priceInCents: 499,
    maxNumberOfGenerationsPerMonth: 2500,
    maxNumberOfLanguages: 5,
    canSaveFlashcards: true,
    canAccessCommunityFlashCards: false,
    canAccessMemorizationPractice: true,
    canDownloadAudio: true,
    // canAccessAdvancedSentencePacks: true,
    // canAccessAdvancedSpacedRepetition: true,
    // canAccessOfflineMode: true,
    // canAccessCustomSentenceGeneration: true,
    // canAccessPronunciationFeedback: true,
    // canAccessLocalSlang: true,
    // canAccessCustomPracticeReminders: true,
    // canAccessPersonalizedLearningPaths: false,
    // canAccessSpecialIslands: false,
    // canAccessPrioritySupport: false,
    // canAccessCommunityFlashCards: false,
  },
  Premium: {
    name: "Premium",
    priceInCents: 999,
    maxNumberOfGenerationsPerMonth: 5000,
    maxNumberOfLanguages: Infinity,
    canSaveFlashcards: true,
    canAccessCommunityFlashCards: true,
    canAccessMemorizationPractice: true,
    canDownloadAudio: true,
    // canAccessAdvancedSentencePacks: true,
    // canAccessAdvancedSpacedRepetition: true,
    // canAccessOfflineMode: true,
    // canAccessCustomSentenceGeneration: true,
    // canAccessPronunciationFeedback: true,
    // canAccessLocalSlang: true,
    // canAccessCustomPracticeReminders: true,
    // canAccessPersonalizedLearningPaths: true,
    // canAccessSpecialIslands: true,
    // canAccessPrioritySupport: true,
    // canAccessLanguagePartnerCommunity: true,
  },
} as const;

export const subscriptionTiersInOrder = [
  subscriptionTiers.Free,
  subscriptionTiers.Starter,
  subscriptionTiers.Pro,
  subscriptionTiers.Premium,
] as const;
