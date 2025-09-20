import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, Zap } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { TryItOutFormClient } from "./TryItOutFormClient";

export function TryItOutDemo() {
  return (
    <section
      id="demo"
      className="pt-24 pb-20 relative overflow-hidden min-h-[100vh] bg-gray-50"
    >
      {/* Simple clean background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgb(52 211 153) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgb(94 234 212) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0, 25px 25px",
          }}
        />
      </div>

      <div className="container px-8 md:px-16 max-w-6xl mx-auto relative z-0 mt-8">
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 text-balance flex items-center justify-center gap-3">
              Welcome to Speech Islands
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl max-w-screen-xl mb-6 text-muted-foreground">
            Generate AI-powered flashcards for real conversations
          </p>
          <div className="flex flex-row gap-4 justify-center mb-6">
            <SignUpButton>
              <Button
                variant="cta"
                className="text-lg p-6 rounded-xl flex gap-2"
              >
                <Zap className="size-5 md:size-6" />
                Start Learning Free
                <ArrowRightIcon className="size-5 md:size-6" />
              </Button>
            </SignUpButton>
          </div>
        </div>

        <div>
          <Card className="shadow-2xl border-2 hover:shadow-3xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center text-xl md:text-2xl">
                <span className="text-4xl animate-pulse">🌍</span>
                Try it out! Generate Flashcards
                <span className="text-4xl animate-pulse">🌍</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TryItOutFormClient />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}