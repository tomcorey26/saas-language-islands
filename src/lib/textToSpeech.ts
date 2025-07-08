import { SupportedLanguageCode } from "@/data/supportedLanguages";

interface SpeakOptions {
  lang: SupportedLanguageCode;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

// TOMDO: Add support for dialect choice
export function speak(
  text: string,
  options: SpeakOptions | SupportedLanguageCode
) {
  // Handle both string and options object for backward compatibility
  const opts: SpeakOptions =
    typeof options === "string" ? { lang: options } : options;

  try {
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      throw new Error("Speech synthesis is not supported in this browser");
    }

    // Check if text is provided
    if (!text || text.trim().length === 0) {
      throw new Error("No text provided for speech synthesis");
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text.trim());

    // Set language code with fallback
    utterance.lang = opts.lang;

    // Set optional properties
    if (opts.rate !== undefined)
      utterance.rate = Math.max(0.1, Math.min(10, opts.rate));
    if (opts.pitch !== undefined)
      utterance.pitch = Math.max(0, Math.min(2, opts.pitch));
    if (opts.volume !== undefined)
      utterance.volume = Math.max(0, Math.min(1, opts.volume));

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Try to find a voice for the specified language
    let voice = voices.find((v) => v.lang.startsWith(opts.lang));

    // Fallback: if no exact match, try to find any voice with similar language code
    if (!voice) {
      voice = voices.find((v) => v.lang.includes(opts.lang));
    }

    // Fallback: if still no match, use the first available voice
    if (!voice && voices.length > 0) {
      voice = voices[0];
      console.warn(
        `No voice found for language ${opts.lang}, using default voice: ${voice.name}`
      );
    }

    if (voice) {
      utterance.voice = voice;
    }

    // Set up event handlers
    utterance.onstart = () => {
      opts.onStart?.();
    };

    utterance.onend = () => {
      opts.onEnd?.();
    };

    utterance.onerror = (event) => {
      const error = new Error(`Speech synthesis error: ${event.error}`);
      opts.onError?.(error);
      console.error("Speech synthesis error:", event.error);
    };

    // Stop any currently speaking utterance
    window.speechSynthesis.cancel();

    // Start speaking
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Text-to-speech error:", errorMessage);
    opts.onError?.(error instanceof Error ? error : new Error(errorMessage));
  }
}

// Helper function to check if speech synthesis is available
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Helper function to get available voices
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

// Helper function to stop all speech
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
