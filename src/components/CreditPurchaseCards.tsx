import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { paymentTiers } from "@/data/paymentTiers";
import { Sparkles } from "lucide-react";

// Simple emoji icons for each tier
const IslandIcon = ({ tier }: { tier: string; className?: string }) => {
  if (tier === "Starter") return "🌴";
  if (tier === "Pro") return "🏝️";
  if (tier === "Premium") return "👑";
  return null;
};

export function CreditPurchaseCards() {
  // Filter out the free tier for purchase display
  const purchasableTiers = Object.entries(paymentTiers).filter(
    ([, tier]) => tier.priceInCents > 0
  );

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const calculatePerGenerationCost = (
    priceInCents: number,
    generationCount: number
  ) => {
    const costPer = priceInCents / 100 / generationCount;
    if (costPer >= 0.01) {
      return `$${costPer.toFixed(3)} per generation`;
    } else {
      // For very small amounts, show as "X generations per dollar"
      const generationsPerDollar = Math.floor(
        generationCount / (priceInCents / 100)
      );
      return `${generationsPerDollar} flashcard generations per $1`;
    }
  };

  const getGradientColors = (index: number) => {
    const gradients = [
      "from-emerald-400 to-teal-600", // Starter - Fresh island green
      "from-orange-400 to-red-500", // Pro - Sunset colors
      "from-purple-500 to-indigo-600", // Premium - Luxurious purple
    ];
    return gradients[index % gradients.length];
  };

  const getTierSpecialFeatures = (tierKey: string) => {
    if (tierKey === "Pro") {
      return {
        badge: "Most Popular",
        badgeColor: "bg-orange-500",
        scale: "md:scale-105",
        zIndex: "z-10",
        shadow: "shadow-2xl",
        border: "border-orange-200 dark:border-orange-800",
      };
    }
    if (tierKey === "Premium") {
      return {
        badge: "Best Value",
        badgeColor: "bg-purple-500",
        scale: "",
        zIndex: "z-5",
        shadow: "shadow-xl",
        border: "border-purple-200 dark:border-purple-800",
      };
    }
    return {
      badge: null,
      badgeColor: "",
      scale: "",
      zIndex: "z-0",
      shadow: "shadow-lg",
      border: "border-gray-200 dark:border-gray-800",
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto p-6">
      {purchasableTiers.map(([tierKey, tier], index) => {
        const features = getTierSpecialFeatures(tierKey);

        return (
          <div
            key={tierKey}
            className={`relative ${features.scale} ${features.zIndex} group`}
          >
            {/* Popular/Best Value Badge */}
            {features.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                <Badge
                  className={`${features.badgeColor} text-white px-3 py-1 text-sm font-semibold shadow-lg`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {features.badge}
                </Badge>
              </div>
            )}

            <Card
              className={`
                relative overflow-hidden ${features.border} border-2 
                ${features.shadow} hover:shadow-2xl 
                transition-all duration-500 ease-out hover:border-primary/50 
                bg-gradient-to-br from-background to-muted/30
                transform
              `}
            >
              <CardContent className="p-8 text-center">
                {/* Island Icon with subtle hover effect */}
                <div className="mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out">
                  <div className="text-6xl group-hover:scale-105 transition-transform duration-300 ease-out">
                    <IslandIcon tier={tierKey} />
                  </div>
                </div>

                {/* Tier Name */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>

                {/* Generation Count with emphasis */}
                <p className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {tier.generationCount.toLocaleString()}
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  Island Generations
                </p>

                {/* Per-generation cost */}
                <p className="text-muted-foreground mb-8 text-sm">
                  {calculatePerGenerationCost(
                    tier.priceInCents,
                    tier.generationCount
                  )}
                </p>

                {/* Enhanced Purchase Button */}
                <Button
                  className={`
                    w-full py-3 px-6 text-white font-semibold text-lg
                    bg-gradient-to-r ${getGradientColors(index)} 
                    hover:shadow-lg hover:shadow-primary/25
                    transition-shadow duration-300
                    border-0 relative overflow-hidden
                  `}
                >
                  <span className="relative z-10">
                    Buy for {formatPrice(tier.priceInCents)}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
