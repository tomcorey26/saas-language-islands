import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center mb-8">
      <div className="inline-block">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-balance flex items-center justify-center gap-3">
          <span className="inline-block">🏝️</span>
          Welcome to Speech Islands
          <span className="inline-block">🌍</span>
        </h1>
      </div>
      <p className="text-sm md:text-base lg:text-lg max-w-screen-xl mb-6 text-muted-foreground">
        Generate AI-powered flashcards for real conversations
      </p>
      <div className="flex flex-row gap-4 justify-center mb-6">
        <SignUpButton>
          <Button
            variant="cta"
            className="text-base md:text-lg p-4 md:p-6 rounded-full flex gap-2 shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-2 border-green-400"
          >
            <Zap className="size-5" />
            Start Learning Free
            <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>
      </div>
    </div>
  );
}