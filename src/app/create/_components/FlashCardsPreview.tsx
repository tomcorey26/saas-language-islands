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
  const accordionItems = flashcards.map((section) =>
    section.flashcards.length > 0 ? (
      <AccordionItem key={section.category} value={section.category}>
        <AccordionTrigger className="text-lg font-semibold">
          {section.category.charAt(0).toUpperCase() + section.category.slice(1)}
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {section.flashcards.map((flashcard, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{flashcard.sentence}</div>
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
              {formData.cardsPerCategory} cards per category in{" "}
              {formData.language}
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
                <Button className="w-full">Study Deck</Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
