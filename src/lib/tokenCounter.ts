import { encode } from "gpt-tokenizer";

// Message interface for type safety
interface Message {
  role: string;
  content: string;
}

/**
 * Count tokens in a string or array of messages
 * Uses gpt-tokenizer to accurately count tokens for gpt-4o-mini model
 */
export function countTokens(content: string | Message[]): number {
  if (typeof content === "string") {
    return encode(content).length;
  }

  // For message arrays, count all content + role overhead
  return content.reduce((total, msg) => {
    const msgTokens = encode(msg.content).length;
    const roleOverhead = 4; // Approximate overhead per message for role/formatting
    return total + msgTokens + roleOverhead;
  }, 0);
}
