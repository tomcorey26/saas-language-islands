"use server";

import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { DEMO_CONFIG } from "@/constants/examples";
import { unstable_noStore as noStore } from "next/cache";
import {
  DemoRequestSchema,
  DemoResponse,
  DemoResponseSchema,
} from "@/zod/contracts/demo.schema";
import {
  SupportedLanguageCode,
  supportedLanguages,
} from "@/data/supportedLanguages";

const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting store - in production, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();

  // Try to get IP from various headers
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfIp = headersList.get("cf-connecting-ip");

  const ip = forwarded?.split(",")[0] || realIp || cfIp || "unknown";

  // Create a fingerprint combining IP and user agent with proper hashing
  const userAgent = headersList.get("user-agent") || "unknown";
  const combinedInfo = `${ip}-${userAgent}`;
  
  // Hash the combined information to avoid collisions and protect privacy
  const hash = createHash("sha256").update(combinedInfo).digest("hex");
  return hash.substring(0, 16); // Use first 16 characters for the fingerprint
}

function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

function generateDemoPrompt(
  userPrompt: string,
  language: SupportedLanguageCode
): string {
  const targetLanguage = supportedLanguages[language].name;

  if (!targetLanguage) {
    throw new Error(`Language ${language} not supported`);
  }

  return `You are creating sample flashcards for a language learning demo. 
  Generate exactly 5 flashcards based on this scenario: "${userPrompt}" for learning ${targetLanguage}.
  
  Rules:
  - Each flashcard should have a "phrase" in English and "translation" in ${targetLanguage} The 
  phrase field should always be in English, not ${targetLanguage}. And the translation field should always be in ${targetLanguage}.
  - Make the flashcards practical and useful for the scenario
  - Include a mix of statements, questions, and common expressions
  - Keep phrases conversational and realistic
  - Ensure variety in the types of phrases (greetings, questions, responses, etc.)
  
  Example scenario: "Ordering coffee in Spanish"
  Should produce flashcards like:
  - "Can I have a coffee, please?" → "¿Puedo tomar un café, por favor?"
  - "How much does it cost?" → "¿Cuánto cuesta?"
  - etc.`;
}

export async function generateDemoFlashcards(
  prompt: string,
  language: SupportedLanguageCode
): Promise<
  | { success: true; data: DemoResponse }
  | { success: false; error: string; retryAfter?: number }
> {
  noStore(); // Prevent caching of this server action

  try {
    // Validate input
    const validation = DemoRequestSchema.safeParse({ prompt, language });
    if (!validation.success) {
      return {
        success: false,
        error:
          "Invalid request. Please provide a valid prompt (1-100 characters).",
      };
    }

    // Check rate limit
    const identifier = await getClientIdentifier();
    const rateLimitCheck = checkRateLimit(identifier);

    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitCheck.retryAfter,
      };
    }

    // Additional security checks
    const normalizedPrompt = validation.data.prompt.trim().toLowerCase();

    // Check for potential abuse patterns
    const blockedPatterns = [
      /jailbreak/i,
      /ignore.*instruction/i,
      /system.*prompt/i,
      /\bdan\b/i, // DAN jailbreak attempts
      /developer.*mode/i,
    ];

    if (blockedPatterns.some((pattern) => pattern.test(normalizedPrompt))) {
      return {
        success: false,
        error: "Invalid prompt detected. Please try a different scenario.",
      };
    }

    // Generate flashcards using OpenAI
    const completion = await openAiClient.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful language learning assistant. Only generate educational flashcards. Do not generate any inappropriate, harmful, or non-educational content.",
        },
        {
          role: "user",
          content: generateDemoPrompt(
            validation.data.prompt,
            validation.data.language
          ),
        },
      ],
      response_format: zodResponseFormat(DemoResponseSchema, "demo_response"),
      temperature: 0.7,
      max_tokens: DEMO_CONFIG.MAX_TOKENS, // Limit token usage
    });

    const result = completion.choices[0].message;

    if (result.refusal || !result.parsed) {
      console.error("OpenAI refusal or parsing error:", result.refusal);
      return {
        success: false,
        error:
          "Unable to generate appropriate flashcards for this prompt. Please try a different scenario.",
      };
    }

    // Final content validation
    const flashcards = result.parsed.flashcards;

    // Check that flashcards are appropriate
    for (const card of flashcards) {
      if (card.phrase.length > 200 || card.translation.length > 200) {
        return {
          success: false,
          error:
            "Generated content was too long. Please try a simpler scenario.",
        };
      }
    }

    return {
      success: true,
      data: result.parsed,
    };
  } catch (error) {
    console.error("Demo generation error:", error);

    // Don't expose internal errors to users
    return {
      success: false,
      error:
        "Sorry, we couldn't generate flashcards right now. Please try again in a moment.",
    };
  }
}
