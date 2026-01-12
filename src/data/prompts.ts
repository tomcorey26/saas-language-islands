import {
  SupportedLanguageCode,
  supportedLanguages,
} from "@/data/supportedLanguages";

/**
 * Default base language for users who haven't set a preference
 */
export const DEFAULT_BASE_LANGUAGE: SupportedLanguageCode = "en";

/**
 * Helper to get the full language name from a language code
 */
export function getLanguageName(code: SupportedLanguageCode): string {
  return supportedLanguages[code].name;
}

// ============================================================================
// World Generation Prompt (Initial onboarding flow)
// ============================================================================

interface WorldPromptParams {
  targetLanguage: SupportedLanguageCode;
  baseLanguage: SupportedLanguageCode;
  name: string;
  occupation: string;
  location: string;
  interests: string[];
  commonScenarios: string[];
}

/**
 * Generates the prompt for creating a world with islands of flashcards
 * Used in: src/services/ai.ts - generateWorld()
 */
export function generateWorldPrompt(params: WorldPromptParams): string {
  const targetLangName = getLanguageName(params.targetLanguage);
  const baseLangName = getLanguageName(params.baseLanguage);

  return `
  The user has selected filled out a form related to with their name, occupation, and interests, and you need to generate flashcards of useful sentences
  that the user can study to become conversant in ${targetLangName}. The sentence field is ${baseLangName}, and the translation field is ${targetLangName}.

  Here is the user's form data:
  ${JSON.stringify(params)}

  List of things you must do:
  - DO NOT Generate flashcards for fields that the user has not selected, just return an empty array for that category
  - Generate 5 flashcards using the user's name: ${params.name} for the introduction category
  - Generate 5 flashcards using the user's occupation: ${params.occupation} for the occupation category
  - Generate 5 flashcards using the user's location: ${params.location} for the location category
  - Generate 5 flashcards for each interest that the user has selected: ${params.interests.join(", ")}
  -  Generate 5 flashcards for each scenario that the user has selected: ${params.commonScenarios.join(", ")}
  - Make sure the flashcards are relevant to the user's form data and that they don't all begin with I
  - Make sure that the sentences generated are practical and useful for having a conversation with someone in ${targetLangName}.
  - Make sure that at least 1 flashcard is a question that the user can ask, and at least 1 flashcard is a statement that the user can make.
  `;
}

// ============================================================================
// Island Flashcard Generation Prompt (Creating flashcards within a deck)
// ============================================================================

interface IslandFlashcardsPromptParams {
  targetLanguage: SupportedLanguageCode;
  baseLanguage: SupportedLanguageCode;
  prompt: string;
  count: number;
}

/**
 * Generates the prompt for creating flashcards within an island
 * Used in: src/services/ai.ts - generateFlashcardsIsland() and streamFlashcardsIsland()
 */
export function generateIslandFlashcardsPrompt(
  params: IslandFlashcardsPromptParams
): string {
  const targetLangName = getLanguageName(params.targetLanguage);
  const baseLangName = getLanguageName(params.baseLanguage);

  return `You are a helpful assistant that generates flashcards that are useful for a conversation with a native speaker.
  You will generate a sentence in ${baseLangName}, for the phrase field, and the translation field will be the translation of the sentence in ${targetLangName}.
  The flashcards should be relevant to the user's prompt: ${params.prompt}.
  The flashcards should be ${params.count} flashcards.
  Please make sure that the flashcards are relevant to the user's prompt and that they are useful for a conversation with a native speaker of ${targetLangName}.

  Additionally, please generate a short, descriptive name (2-4 words) for this collection of flashcards based on the prompt and content. This name should be concise and capture the essence of what these flashcards cover.
  `;
}

// ============================================================================
// Stream Island Generation Prompt (API route for streaming flashcard generation)
// ============================================================================

interface StreamIslandPromptParams {
  targetLanguage: SupportedLanguageCode;
  baseLanguage: SupportedLanguageCode;
  prompt: string;
  count: number;
}

/**
 * Generates the prompt for streaming flashcard generation via API
 * Used in: src/app/api/use-island/route.ts
 */
export function generateStreamIslandPrompt(
  params: StreamIslandPromptParams
): string {
  const targetLangName = getLanguageName(params.targetLanguage);
  const baseLangName = getLanguageName(params.baseLanguage);

  return `Generate exactly ${params.count} flashcards for learning ${targetLangName}. The flashcards should be based on this prompt: ${params.prompt}

      Requirements:
      - The phrase field should be in ${baseLangName}
      - The translation field should be in ${targetLangName}
      - Make the flashcards relevant to the prompt
      - Make them useful for conversation with a native speaker
      - Include a mix of questions and statements`;
}

// ============================================================================
// Demo Flashcard Generation Prompt (Public landing page demo)
// ============================================================================

interface DemoFlashcardsPromptParams {
  targetLanguage: SupportedLanguageCode;
  userPrompt: string;
}

/**
 * Generates the prompt for demo flashcard generation (public landing page)
 * Auto-detects the input language and translates to target language
 * Used in: src/server/actions/demo.ts
 */
export function generateDemoFlashcardsPrompt(
  params: DemoFlashcardsPromptParams
): string {
  const targetLangName = getLanguageName(params.targetLanguage);

  return `You are creating sample flashcards for a language learning demo.
  Generate exactly 5 flashcards based on this scenario: "${params.userPrompt}" for learning ${targetLangName}.

  Rules:
  - Detect what language the user's prompt is written in
  - The "phrase" field should be in the same language as the user's prompt
  - The "translation" field should be in ${targetLangName}
  - Make the flashcards practical and useful for the scenario
  - Include a mix of statements, questions, and common expressions
  - Keep phrases conversational and realistic
  - Ensure variety in the types of phrases (greetings, questions, responses, etc.)

  Example: If the user writes "Ordering coffee" in English and wants to learn Spanish:
  - phrase: "Can I have a coffee, please?" -> translation: "¿Puedo tomar un café, por favor?"

  Example: If the user writes "Commander un café" in French and wants to learn Spanish:
  - phrase: "Je voudrais un café" -> translation: "Me gustaría un café"`;
}
