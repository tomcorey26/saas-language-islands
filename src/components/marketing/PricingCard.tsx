import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/formatters";
import { FEATURES } from "@/data/marketing";

interface PricingCardProps {
  name: string;
  priceInCents: number;
  generationCount: number;
  icon: string;
  stripePriceId?: string;
  className?: string;
  mostPopular?: boolean;
  showFeatures?: boolean;
  size?: "default" | "compact";
}

export function PricingCard({
  name,
  generationCount,
  priceInCents,
  icon,
  className,
  mostPopular,
  showFeatures = true,
  size = "default",
}: PricingCardProps) {
  const isFree = priceInCents === 0;
  const isPopular = mostPopular ?? name === "2000 Generations";

  const description =
    generationCount === Infinity
      ? "Unlimited flashcard generations"
      : `${formatCompactNumber(generationCount)} flashcard generations`;

  const features = showFeatures
    ? [
        ...FEATURES.core,
        ...(isFree ? [] : FEATURES.premium.slice(0, 1)),
        ...(isPopular ? ["Best value"] : []),
      ]
    : [];

  return (
    <Card
      className={cn(
        "relative",
        isPopular && "ring-2 ring-blue-500 shadow-lg scale-105",
        isFree && "bg-gray-50",
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="text-center">
        {size === "default" && <div className="text-4xl mb-2">{icon}</div>}
        <CardTitle
          className={cn(
            "font-semibold",
            size === "default" ? "text-lg" : "text-base"
          )}
        >
          {name}
        </CardTitle>
        <div
          className={cn(
            "font-bold",
            size === "default" ? "text-3xl" : "text-2xl"
          )}
        >
          {isFree ? "Free" : `$${(priceInCents / 100).toFixed(2)}`}
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <SignUpButton asChild>
          <Button
            className={cn(
              "w-full",
              isPopular && "bg-blue-600 hover:bg-blue-700",
              isFree && "bg-gray-600 hover:bg-gray-700",
              !isPopular && !isFree && "bg-gray-800 hover:bg-gray-900"
            )}
            variant="default"
          >
            {isFree ? "Start Free" : "Get Started"}
          </Button>
        </SignUpButton>
      </CardContent>

      {showFeatures && features.length > 0 && (
        <CardFooter className="flex flex-col gap-3 items-start pt-4">
          {features.map((feature, index) => (
            <Feature
              key={index}
              className={
                feature === "Best value"
                  ? "text-blue-600 font-semibold"
                  : undefined
              }
            >
              {feature}
            </Feature>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

function Feature({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <CheckIcon className="size-4 text-green-500 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}
