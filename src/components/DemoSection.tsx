import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Star } from "lucide-react";
import { supportedLanguagesArray } from "@/data/supportedLanguages";
import { DemoForm } from "./DemoForm";
import { HeroSection } from "./HeroSection";

export function DemoSection() {
  const defaultLanguage = "es";
  const selectedLangData = supportedLanguagesArray.find(
    (lang) => lang.languageCode === defaultLanguage
  );

  return (
    <section
      id="demo"
      className="min-h-screen py-20 flex items-center relative overflow-hidden"
    >
      {/* Static background gradient */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-red-700 via-yellow-400 to-red-700" />

      <div className="container px-8 md:px-16 max-w-6xl mx-auto relative z-10">
        <HeroSection />

        <Card className="shadow-2xl border-2 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center text-xl md:text-2xl">
              <Sparkles className="size-6 text-yellow-500" />
              Try it out! Generate {selectedLangData?.name}{" "}
              {selectedLangData?.flag} Flashcards
              <Star className="size-5 text-yellow-500 fill-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DemoForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}