import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import {
  CreateWorldRequest,
  CreateWorldResponse,
} from "@/zod/contracts/world.schema";
import { useMemo, useEffect } from "react";

interface PreviewFlashcardsProps {
  flashcards: CreateWorldResponse["flashcards"];
  formData: CreateWorldRequest;
  onBack: () => void;
}

export function PreviewFlashcards({
  flashcards,
  formData,
  onBack,
}: PreviewFlashcardsProps) {
  const memoizedFlashcards = useMemo(() => {
    const categories = Object.entries(flashcards)
      .map(([category, cards]) => ({
        category,
        flashcards: cards,
      }))
      .filter((section) => section.flashcards.length > 0);

    return categories;
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem(
      "pendingDeck",
      JSON.stringify({
        name: formData.name,
        flashcards: memoizedFlashcards,
        timestamp: Date.now(),
      })
    );
  }, [formData.name, memoizedFlashcards]);

  const accordionItems = memoizedFlashcards.map((section) =>
    section.flashcards.length > 0 ? (
      <AccordionItem key={section.category} value={section.category}>
        <AccordionTrigger className="text-lg font-semibold">
          {section.category.charAt(0).toUpperCase() + section.category.slice(1)}
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {section.flashcards.map((flashcard, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{flashcard.phrase}</div>
                <div className="text-gray-600">{flashcard.translation}</div>
              </div>
            </Card>
          ))}
        </AccordionContent>
      </AccordionItem>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-800">
              Your Generated Flashcards
            </CardTitle>
            <CardDescription className="text-center">
              Language: {formData.language}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {accordionItems}
            </Accordion>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="w-full" onClick={onBack}>
                Back to Form
              </Button>
              <SignUpButton>
                <Button className="w-full">Sign Up to Save Deck</Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
