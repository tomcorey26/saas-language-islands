"use client";

interface ExamplePromptsProps {
  onExampleClick: (example: string) => void;
  isPending: boolean;
}

export function ExamplePrompts({ onExampleClick, isPending }: ExamplePromptsProps) {
  const examples = [
    `Ordering food at a restaurant`,
    `Asking for directions`,
    `Shopping for clothes`,
    `Booking a hotel room`,
    `Making small talk at work`,
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center">
        Or try one of these examples:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example)}
            className="text-sm px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 rounded-full transition-all border border-accent/20 hover:border-accent/30 shadow-sm hover:shadow-md"
            disabled={isPending}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}