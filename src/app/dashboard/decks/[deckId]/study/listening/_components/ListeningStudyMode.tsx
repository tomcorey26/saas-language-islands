"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Headphones, ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ListeningStudyModeProps {
  deckId: string;
  deckName: string;
}

export function ListeningStudyMode({
  deckId,
  deckName,
}: ListeningStudyModeProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Headphones className="h-10 w-10 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <CardTitle className="text-3xl">Listening Practice</CardTitle>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <CardDescription className="text-lg">
              for <span className="font-semibold">{deckName}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Improve your comprehension with audio-focused exercises that
            emphasize listening and pronunciation skills. Perfect for
            strengthening your ear for the language.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-500" />
              Planned Features
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">•</span>
                <span>
                  Audio-first interface with text-to-speech for all phrases
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">•</span>
                <span>
                  Adjustable playback speed to match your comprehension level
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">•</span>
                <span>Repeat and loop functionality for difficult phrases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">•</span>
                <span>Dictation mode to practice spelling from audio</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/decks/${deckId}/study`)
              }
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modes
            </Button>

            <Button
              onClick={() =>
                router.push(`/dashboard/decks/${deckId}/study/standard`)
              }
              className="flex-1"
            >
              Try Standard Study
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
