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

// Buying tokens to unlock more island generations?

export type TierNames = keyof typeof subscriptionTiers;

export const subscriptionTiers = {
  Hobby: {
    name: "Free",
    priceInCents: 0,
    generationCount: 100,
    // canAccessAdvancedSentencePacks: false,
    maxNumberOfLanguages: Infinity, // just one language
    canSaveFlashcards: false,
    canAccessCommunityFlashCards: false,
    canAccessMemorizationPractice: false,
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
  Pro: {
    name: "1K tokens",
    priceInCents: 299,
    generationCount: 1000,
    maxNumberOfLanguages: Infinity,
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
  // Polyglot: {
  //   name: "Polyglot",
  //   priceInCents: 4000,
  //   generationCount: Infinity,
  //   maxNumberOfLanguages: Infinity,
  //   canSaveFlashcards: true,
  //   canAccessCommunityFlashCards: false,
  //   canAccessMemorizationPractice: true,
  //   canDownloadAudio: true,
  //   // canAccessAdvancedSentencePacks: true,
  //   // canAccessAdvancedSpacedRepetition: true,
  //   // canAccessOfflineMode: true,
  //   // canAccessCustomSentenceGeneration: true,
  //   // canAccessPronunciationFeedback: true,
  //   // canAccessLocalSlang: true,
  //   // canAccessCustomPracticeReminders: true,
  //   // canAccessPersonalizedLearningPaths: false,
  //   // canAccessSpecialIslands: false,
  //   // canAccessPrioritySupport: false,
  //   // canAccessCommunityFlashCards: false,
  // },
  // Premium: {
  //   name: "Premium",
  //   priceInCents: 999,
  //   generationCount: 5000,
  //   maxNumberOfLanguages: Infinity,
  //   canSaveFlashcards: true,
  //   canAccessCommunityFlashCards: true,
  //   canAccessMemorizationPractice: true,
  //   canDownloadAudio: true,
  //   // canAccessAdvancedSentencePacks: true,
  //   // canAccessAdvancedSpacedRepetition: true,
  //   // canAccessOfflineMode: true,
  //   // canAccessCustomSentenceGeneration: true,
  //   // canAccessPronunciationFeedback: true,
  //   // canAccessLocalSlang: true,
  //   // canAccessCustomPracticeReminders: true,
  //   // canAccessPersonalizedLearningPaths: true,
  //   // canAccessSpecialIslands: true,
  //   // canAccessPrioritySupport: true,
  //   // canAccessLanguagePartnerCommunity: true,
  // },
} as const;

export const subscriptionTiersInOrder = [
  subscriptionTiers.Hobby,
  subscriptionTiers.Pro,
  // subscriptionTiers.Polyglot,
  // subscriptionTiers.Premium,
] as const;
