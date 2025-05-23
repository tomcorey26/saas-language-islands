import { zodResponseFormat } from "openai/helpers/zod";
import { OpenAI } from "openai";
import {
  CreateWorldRequest,
  CreateWorldResponseSchema,
} from "@/zod/contracts/world.schema";
import { CreateIslandRequest } from "@/zod/contracts/island.schema";
import { z } from "zod";
const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateIslandsPrompt = (request: CreateWorldRequest) => {
  return `
  The user has selected filled out a form related to with their name, occupation, and interests, and you need to generate flashcards of useful sentences 
  that the user can study to become conversant in ${
    request.language
  }. The sentence field is english, and the translation field is ${
    request.language
  }.


  Here is the user's form data:
  ${JSON.stringify(request)} 

  List of things you must do:
  - DO NOT Generate flashcards for fields that the user has not selected, just return an empty array for that category
  - Generate 5 flashcards using the user's name: ${
    request.name
  } for the introduction category
  - Generate 5 flashcards using the user's occupation: ${
    request.occupation
  } for the occupation category
  - Generate 5 flashcards using the user's location: ${
    request.location
  } for the location category
  - Generate 5 flashcards for each interest that the user has selected: ${request.interests.join(
    ", "
  )}
  -  Generate 5 flashcards for each scenario that the user has selected: ${request.commonScenarios.join(
    ", "
  )}
  - Make sure the flashcards are relevant to the user's form data and that they don't all begin with I
  - Make sure that the sentences generated are practical and useful for having a conversation with someone in ${
    request.language
  }.
  - Make sure that at least 1 flashcard is a question that the user can ask, and at least 1 flashcard is a statement that the user can make.
  `;
};

export async function generateWorld(request: CreateWorldRequest) {
  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: generateIslandsPrompt(request) }],
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

function generateFlashcardsIslandPrompt(request: CreateIslandRequest) {
  const translationLanguage = request.language;

  return `You are a helpful assistant that generates flashcards that are useful for a conversation with a native speaker. 
  You will generate a sentence in english, for the phrase field, and the translation field will be the translation of the sentence in ${translationLanguage}.
  The flashcards should be relevant to the user's prompt: ${request.prompt}.
  The flashcards should be ${request.count} flashcards.
  Please make sure that the flashcards are relevant to the user's prompt and that they are useful for a conversation with a native speaker of ${translationLanguage}.
  `;
}

export async function generateFlashcardsIsland(request: CreateIslandRequest) {
  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: generateFlashcardsIslandPrompt(request),
      },
    ],
    response_format: zodResponseFormat(
      z.object({
        island: z.array(
          z.object({
            phrase: z.string(),
            translation: z.string(),
          })
        ),
      }),
      "island_response"
    ),
  });

  const island_response = completion.choices[0].message;

  if (island_response.refusal) {
    throw new Error(island_response.refusal);
  }

  return island_response.parsed;
}
