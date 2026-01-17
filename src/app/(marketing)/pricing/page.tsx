import { Metadata } from "next";
import { CTASection } from "@/components/marketing/CTASection";
import { CheckIcon } from "lucide-react";
import {
  COMPANY,
  META_DESCRIPTIONS,
  UI_TEXT,
  POLICIES,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: `Pricing - ${COMPANY.name}`,
  description: META_DESCRIPTIONS.pricing,
};

export default function PricingPage() {
  const features = [
    "10,000 free tokens to start",
    "AI-powered flashcard generation",
    "Spaced repetition algorithm",
    "Multiple languages supported",
    "Unlimited decks and islands",
    "No credit card required",
  ];

  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              100% Free
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {COMPANY.name} is Free
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start learning with {POLICIES.freeTokens.toLocaleString()} free
              tokens. No credit card required, no hidden fees.
            </p>
          </div>

          {/* Free Plan Card */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-white border-2 border-green-500 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏝️</div>
                <h2 className="text-2xl font-bold mb-2">Free Forever</h2>
                <div className="text-4xl font-bold text-green-600 mb-2">$0</div>
                <p className="text-gray-600">
                  {POLICIES.freeTokens.toLocaleString()} tokens included
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <CTASection
                buttonText={UI_TEXT.cta.getStartedFree}
                className="p-0"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  How do tokens work?
                </h3>
                <p className="text-gray-600 mb-6">
                  Each flashcard generation uses one token. When you create a
                  new island, tokens are consumed based on the number of cards
                  generated. Your token balance is always visible in your
                  dashboard.
                </p>

                <h3 className="font-semibold text-lg mb-3">
                  Is it really free?
                </h3>
                <p className="text-gray-600 mb-6">
                  Yes! {COMPANY.name} is completely free. All new users receive{" "}
                  {POLICIES.freeTokens.toLocaleString()} tokens to generate
                  AI-powered flashcards. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  What happens when I run out of tokens?
                </h3>
                <p className="text-gray-600 mb-6">
                  You can still access and study all your existing flashcards
                  forever. You just won&apos;t be able to generate new ones
                  until you have more tokens.
                </p>

                <h3 className="font-semibold text-lg mb-3">
                  How many flashcards can I create?
                </h3>
                <p className="text-gray-600 mb-6">
                  With {POLICIES.freeTokens.toLocaleString()} tokens, you can
                  generate up to {POLICIES.freeTokens.toLocaleString()}{" "}
                  flashcards. Each card costs 1 token to generate.
                </p>
              </div>
            </div>
          </div>

          <CTASection
            title="Ready to Start Learning?"
            description={`Create an account and start learning with ${POLICIES.freeTokens.toLocaleString()} free tokens.`}
            buttonText={UI_TEXT.cta.getStartedFree}
            className="rounded-lg"
          />
        </div>
      </section>
    </main>
  );
}
