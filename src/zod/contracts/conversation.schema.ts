import { z } from "zod";

// Request to start a new conversation
export const startConversationRequestSchema = z.object({
  customPrompt: z.string().min(10).max(500),
  targetLanguage: z.string().min(2).max(50),
});

// UI Message part schema (from AI SDK)
const uiMessagePartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
});

// UI Message schema (from AI SDK)
const uiMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(uiMessagePartSchema),
  createdAt: z.coerce.date().optional(),
});

// Request to send a chat message (DefaultChatTransport format)
export const chatMessageRequestSchema = z.object({
  conversationId: z.string().uuid(),
  messages: z.array(uiMessageSchema),
});

// Error detection schema
export const errorDetectionSchema = z.object({
  hasError: z.boolean(),
  errors: z.array(
    z.object({
      errorType: z.enum(["grammar", "vocabulary", "pronunciation", "context"]),
      errorText: z.string(),
      correction: z.string(),
      explanation: z.string(),
      severity: z.enum(["minor", "moderate", "major"]),
    })
  ),
});

// AI assistant response schema (for streaming)
export const assistantResponseSchema = z.object({
  message: z.string().describe("AI tutor's response in target language"),
  translation: z.string().describe("English translation of the response"),
  errorAnalysis: errorDetectionSchema,
});

// Conversation list item schema
export const conversationListItemSchema = z.object({
  id: z.string(),
  customPrompt: z.string(),
  totalMessages: z.number(),
  errorCount: z.number(),
  status: z.string(),
  createdAt: z.date(),
});

// Type exports
export type StartConversationRequest = z.infer<
  typeof startConversationRequestSchema
>;
export type ChatMessageRequest = z.infer<typeof chatMessageRequestSchema>;
export type ErrorDetection = z.infer<typeof errorDetectionSchema>;
export type AssistantResponse = z.infer<typeof assistantResponseSchema>;
export type ConversationListItem = z.infer<typeof conversationListItemSchema>;
