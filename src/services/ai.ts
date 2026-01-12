import { zodResponseFormat } from "openai/helpers/zod";
import { OpenAI } from "openai";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamObject } from "ai";
import {
  CreateWorldRequest,
  CreateWorldResponseSchema,
} from "@/zod/contracts/world.schema";
import { CreateIslandRequest } from "@/zod/contracts/island.schema";
import { z } from "zod";
import { SupportedLanguageCode } from "@/data/supportedLanguages";
import {
  generateWorldPrompt,
  generateIslandFlashcardsPrompt,
  DEFAULT_BASE_LANGUAGE,
} from "@/data/prompts";

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type CreateWorldRequestWithBaseLanguage = CreateWorldRequest & {
  baseLanguage?: SupportedLanguageCode;
};

export async function generateWorld(request: CreateWorldRequestWithBaseLanguage) {
  const prompt = generateWorldPrompt({
    targetLanguage: request.language as SupportedLanguageCode,
    baseLanguage: request.baseLanguage ?? DEFAULT_BASE_LANGUAGE,
    name: request.name,
    occupation: request.occupation,
    location: request.location,
    interests: request.interests,
    commonScenarios: request.commonScenarios,
  });

  const completion = await openAiClient.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(
      CreateWorldResponseSchema,
      "world_response"
    ),
  });

  const world_response = completion.choices[0].message;

  if (world_response.refusal) {
    throw new Error(world_response.refusal);
  }

  return world_response.parsed;
}

type CreateIslandRequestWithLanguage = CreateIslandRequest & {
  language: SupportedLanguageCode;
  baseLanguage?: SupportedLanguageCode;
};

const FlashcardIslandSchema = z.object({
  island: z.array(
    z.object({
      phrase: z.string(),
      translation: z.string(),
    })
  ),
  name: z.string().min(1).max(50),
});

export async function generateFlashcardsIsland(
  request: CreateIslandRequestWithLanguage
) {
  const prompt = generateIslandFlashcardsPrompt({
    targetLanguage: request.language,
    baseLanguage: request.baseLanguage ?? DEFAULT_BASE_LANGUAGE,
    prompt: request.prompt,
    count: request.count,
  });

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: FlashcardIslandSchema,
    prompt,
  });

  return result.object;
}

export function streamFlashcardsIsland(
  request: CreateIslandRequestWithLanguage
) {
  const prompt = generateIslandFlashcardsPrompt({
    targetLanguage: request.language,
    baseLanguage: request.baseLanguage ?? DEFAULT_BASE_LANGUAGE,
    prompt: request.prompt,
    count: request.count,
  });

  const result = streamObject({
    model: openai("gpt-4o-mini"),
    schema: FlashcardIslandSchema,
    prompt,
  });

  return result;
}
