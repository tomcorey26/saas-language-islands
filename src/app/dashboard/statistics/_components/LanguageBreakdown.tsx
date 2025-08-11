"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe } from "lucide-react";
import { supportedLanguages } from "@/data/supportedLanguages";

interface LanguageBreakdownProps {
  languages: Record<string, { decks: number; cards: number; mastered: number }>;
}

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  const languageData = Object.entries(languages).map(([lang, stats]) => ({
    language: lang,
    ...stats,
    masteryRate: stats.cards > 0 ? (stats.mastered / stats.cards) * 100 : 0,
  })).sort((a, b) => b.cards - a.cards);

  const totalCards = languageData.reduce((sum, lang) => sum + lang.cards, 0);

  const getLanguageInfo = (languageCode: string) => {
    const langData = Object.values(supportedLanguages).find(
      lang => lang.languageCode === languageCode
    );
    return {
      name: langData?.name || languageCode.toUpperCase(),
      flag: langData?.flag || "🌍"
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Language Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {languageData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No languages started yet
          </p>
        ) : (
          <div className="space-y-4">
            {languageData.map((lang) => {
              const langInfo = getLanguageInfo(lang.language);
              return (
                <div key={lang.language} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{langInfo.flag}</span>
                      <span className="font-medium">{langInfo.name}</span>
                    </div>
                  <div className="text-sm text-muted-foreground">
                    {lang.cards} cards
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress value={lang.masteryRate} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{lang.mastered} mastered</span>
                    <span>{lang.masteryRate.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 rounded px-2 py-1">
                    <span className="text-muted-foreground">Decks: </span>
                    <span className="font-medium">{lang.decks}</span>
                  </div>
                  <div className="bg-muted/50 rounded px-2 py-1">
                    <span className="text-muted-foreground">Progress: </span>
                    <span className="font-medium">
                      {((lang.cards / totalCards) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}