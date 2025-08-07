"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Send, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface FlashCard {
  phrase: string;
  translation: string;
}

interface DemoResponse {
  flashcards: FlashCard[];
}

export function TryItOutDemo() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setFlashcards([]);

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate flashcards");
      }

      const data: DemoResponse = await response.json();
      setFlashcards(data.flashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const examples = [
    "Ordering food at a restaurant in Spanish",
    "Asking for directions in French",
    "Shopping for clothes in Italian",
    "Booking a hotel room in German",
    "Making small talk at work in Portuguese",
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <section id="demo" className="py-16 bg-gradient-to-b from-background to-accent/5">
      <div className="container px-8 md:px-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Try it out now
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any language learning scenario below and get 5 sample flashcards instantly. 
            No signup required!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Sparkles className="size-5 text-purple-500" />
                Language Learning Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Ordering coffee in Spanish"
                    className="flex-1 text-lg py-6"
                    maxLength={100}
                    disabled={isGenerating}
                  />
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="px-6 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Example prompts */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Or try one of these examples:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-sm px-3 py-1 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors"
                      disabled={isGenerating}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-center p-3 bg-red-50 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {flashcards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-center">
                    Your Sample Flashcards:
                  </h3>
                  <div className="grid gap-3">
                    {flashcards.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border rounded-lg bg-gradient-to-r from-accent/5 to-accent/10 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">
                            {card.phrase}
                          </p>
                          <p className="text-muted-foreground">
                            {card.translation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Like what you see? Get personalized flashcards for your learning goals!
                    </p>
                    <Button 
                      variant="cta" 
                      className="text-lg px-6 py-3 rounded-xl"
                      onClick={() => window.location.href = "/sign-up"}
                    >
                      Get Started for Free
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}