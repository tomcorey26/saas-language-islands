import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { chatMessageRequestSchema } from "@/zod/contracts/conversation.schema";
import {
  getConversation,
  incrementConversationStats,
  updateConversationSummary,
} from "@/server/db/conversations";
import {
  getConversationMessages,
  saveMessage,
  markMessagesAsSummarized,
} from "@/server/db/messages";
import { saveConversationErrors } from "@/server/db/conversationErrors";
import { countTokens } from "@/lib/tokenCounter";
import { generateObject } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Constants for Hybrid Summary Buffer
const RAW_MESSAGE_WINDOW = 10; // Keep last 10 messages raw
const MAX_CONTEXT_TOKENS = 108800; // 15% buffer from 128k limit
const SUMMARY_TRIGGER_THRESHOLD = MAX_CONTEXT_TOKENS * 0.8; // 80% threshold

/**
 * Detect errors in user's message and save to database (async)
 */
async function detectAndSaveErrors(
  conversationId: string,
  messageId: string,
  userMessage: string
) {
  try {
    const { object: errorAnalysis } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        hasError: z.boolean(),
        errors: z.array(
          z.object({
            errorType: z.enum([
              "grammar",
              "vocabulary",
              "pronunciation",
              "context",
            ]),
            errorText: z.string(),
            correction: z.string(),
            explanation: z.string(),
            severity: z.enum(["minor", "moderate", "major"]),
          })
        ),
      }),
      prompt: `Analyze this language learning message for errors:

Message: "${userMessage}"

Identify any grammar, vocabulary, pronunciation (spelling), or contextual errors.
For each error, provide:
- The specific error text
- The correction
- A brief explanation
- Severity level (minor/moderate/major)

If there are no errors, return hasError: false with empty errors array.`,
    });

    if (errorAnalysis.hasError && errorAnalysis.errors.length > 0) {
      // Save errors to database
      await saveConversationErrors(
        conversationId,
        messageId,
        errorAnalysis.errors
      );

      // Update conversation error count
      await incrementConversationStats(conversationId, {
        messages: 0,
        errors: errorAnalysis.errors.length,
      });
    }
  } catch (error) {
    console.error("Error detection failed:", error);
  }
}

/**
 * Build conversation context with Hybrid Summary Buffer
 * Recent messages stay verbatim, older messages get summarized
 */
async function buildConversationContext(conversationId: string, userId: string) {
  const messages = await getConversationMessages(conversationId);

  // If we have few messages, return all as-is
  if (messages.length <= RAW_MESSAGE_WINDOW) {
    return messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));
  }

  // Split messages: recent (raw) and older (for summary)
  const recentMessages = messages.slice(-RAW_MESSAGE_WINDOW);
  const olderMessages = messages.slice(0, -RAW_MESSAGE_WINDOW);

  // Get conversation for existing summary
  const conversation = await getConversation(conversationId, userId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Calculate current token usage
  const recentTokens = countTokens(
    recentMessages.map((m) => ({ role: m.role, content: m.content }))
  );
  const summaryTokens = conversation.summaryTokenCount || 0;
  const totalTokens = recentTokens + summaryTokens;

  // If approaching limit, regenerate summary
  if (totalTokens > SUMMARY_TRIGGER_THRESHOLD) {
    console.log("Regenerating conversation summary...");

    // Generate new summary including old summary + older messages
    const summaryPrompt = conversation.conversationSummary
      ? `Previous summary: ${
          conversation.conversationSummary
        }\n\nAdditional messages to summarize:\n${olderMessages
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n")}`
      : `Summarize the following conversation:\n${olderMessages
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n")}`;

    const { object: summaryResponse } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        summary: z
          .string()
          .describe(
            "Concise summary of the conversation so far, preserving key context and errors made"
          ),
      }),
      prompt: `${summaryPrompt}\n\nProvide a concise summary that captures the key points, topics discussed, and any errors the user made. Keep it under 500 tokens.`,
    });

    const newSummary = summaryResponse.summary as string;
    const newSummaryTokens = countTokens(newSummary);

    // Update conversation with new summary
    await updateConversationSummary(
      conversationId,
      newSummary,
      newSummaryTokens
    );

    // Mark older messages as summarized
    await markMessagesAsSummarized(olderMessages.map((m) => m.id));

    // Return summary + recent messages
    return [
      {
        role: "system" as const,
        content: `Conversation summary: ${newSummary}`,
      },
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ];
  }

  // Use existing summary if available
  if (conversation.conversationSummary) {
    return [
      {
        role: "system" as const,
        content: `Conversation summary: ${conversation.conversationSummary}`,
      },
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ];
  }

  // No summary yet, return all messages
  return messages.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));
}

export async function POST(req: Request) {
  try {
    // Authenticate
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request
    const body = await req.json();
    const { conversationId, messages } = chatMessageRequestSchema.parse(body);

    // Extract the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();

    if (!lastUserMessage) {
      return new Response("No user message found", { status: 400 });
    }

    // Extract text from message parts
    const textPart = lastUserMessage.parts.find((p) => p.type === "text");
    const userMessageText = textPart?.text;

    if (!userMessageText) {
      return new Response("No text content in message", { status: 400 });
    }

    // Verify conversation ownership and status
    const conversation = await getConversation(conversationId, userId);
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    if (conversation.status !== "active") {
      return new Response("Conversation is not active", { status: 400 });
    }

    // Build conversation context with Hybrid Summary Buffer
    const context = await buildConversationContext(conversationId, userId);

    // Stream AI response
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `You are a language tutor helping the user practice conversation. Scenario: ${conversation.customPrompt}

IMPORTANT RULES:
- Respond ONLY in the target language - NO English translations or explanations
- Keep responses short and natural (1-3 sentences)
- Stay in character for the scenario
- If the user makes a mistake, gently continue the conversation without explicitly correcting them`,
        },
        ...context,
        {
          role: "user",
          content: userMessageText,
        },
      ],
      onFinish: async ({ text }) => {
        try {
          // Save user message first
          const userMessageRecord = await saveMessage({
            conversationId,
            role: "user",
            content: userMessageText,
            hasError: false, // Will update after error detection
            tokenCount: countTokens(userMessageText),
          });

          // Save assistant message
          await saveMessage({
            conversationId,
            role: "assistant",
            content: text,
            tokenCount: countTokens(text),
          });

          // Detect errors in user's message (async, non-blocking)
          detectAndSaveErrors(
            conversationId,
            userMessageRecord.id,
            userMessageText
          ).catch((err) => console.error("Error detection failed:", err));

          // Update conversation stats
          await incrementConversationStats(conversationId, {
            messages: 2, // user + assistant
            errors: 0, // Will be updated by error detection
          });
        } catch (error) {
          console.error("Error saving messages:", error);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
