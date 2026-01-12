import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, Zap } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { TryItOutFormClient } from "./TryItOutFormClient";
import { supportedLanguagesArray } from "@/data/supportedLanguages";

export function TryItOutDemo() {
  const animationTypes = ["slow", "medium", "bob"];

  // Generate random positions and delays for each language
  const bubbleData = supportedLanguagesArray.map((_, index) => ({
    // eslint-disable-next-line react-hooks/purity
    topPosition: Math.random() * 90 + 5, // 5% to 95% from top
    // eslint-disable-next-line react-hooks/purity
    animationDelay: Math.random() * -60, // Random delay between 0 and -60 seconds
    animationType: animationTypes[index % animationTypes.length],
  }));

  return (
    <section
      id="demo"
      className="pt-24 pb-20 relative overflow-hidden min-h-[120vh] bg-gray-50"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamically generated floating country flags */}
        {supportedLanguagesArray.map((language, index) => {
          const bubble = bubbleData[index];
          return (
            <div
              key={`${language.languageCode}-${index}`}
              className={`absolute flex items-center justify-center w-32 h-32 md:bg-card md:border md:border-border/20 rounded-full md:shadow-lg animate-float-${bubble.animationType}`}
              style={{
                top: `${bubble.topPosition}%`,
                animationDelay: `${bubble.animationDelay}s`,
              }}
            >
              <span className="text-4xl md:text-6xl">{language.flag}</span>
            </div>
          );
        })}
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
                Try it out! Generate Flashcards
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
