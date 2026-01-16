import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  className?: string;
  variant?: "gradient" | "solid" | "outline";
}

export function CTASection({
  title,
  description,
  buttonText,
  className,
  variant = "gradient",
}: CTASectionProps) {
  const variantClasses = {
    gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
    solid: "bg-blue-600 text-white",
    outline: "bg-white border border-gray-200",
  };

  const buttonClasses = {
    gradient: "bg-white text-blue-600 hover:bg-gray-100",
    solid: "bg-white text-blue-600 hover:bg-gray-100",
    outline: "bg-blue-600 text-white hover:bg-blue-700",
  };

  return (
    <section className={cn(
      "py-16 px-8",
      variantClasses[variant],
      className
    )}>
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className={cn(
          "text-xl mb-8",
          variant === "outline" ? "text-gray-600" : "opacity-90"
        )}>
          {description}
        </p>
        <SignUpButton asChild>
          <Button
            size="lg"
            className={cn(
              "font-semibold px-8 py-3",
              buttonClasses[variant]
            )}
          >
            {buttonText}
          </Button>
        </SignUpButton>
      </div>
    </section>
  );
}