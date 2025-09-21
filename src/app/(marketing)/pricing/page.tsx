import { Metadata } from "next";
import { subscriptionTiersInOrder } from "@/data/paymentTiers";
import { PricingCard } from "@/components/marketing/PricingCard";
import { CTASection } from "@/components/marketing/CTASection";
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
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              No subscriptions, no hidden fees. Purchase tokens once and use
              them to generate AI-powered flashcards whenever you&apos;re ready
              to learn.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium">
                💡 Start with {POLICIES.freeTokens} free tokens to try{" "}
                {COMPANY.name} risk-free!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {subscriptionTiersInOrder.map((tier) => (
              <PricingCard
                {...tier}
                key={tier.name}
                mostPopular={tier.name === "2000 Generations"}
              />
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Compare All Features
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">Pro</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">Flashcard generations</td>
                    <td className="px-6 py-4 text-center">100</td>
                    <td className="px-6 py-4 text-center">500</td>
                    <td className="px-6 py-4 text-center">2,000</td>
                    <td className="px-6 py-4 text-center">5,000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4">AI-powered content</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Spaced repetition</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4">Multiple languages</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Priority support</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4">Export flashcards</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Tokens never expire</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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
                  new island or add cards to an existing one, tokens are
                  consumed. Your token balance is always visible in your
                  dashboard.
                </p>

                <h3 className="font-semibold text-lg mb-3">
                  Do I need a subscription?
                </h3>
                <p className="text-gray-600 mb-6">
                  No! Speech Islands uses a simple token-based system. Purchase
                  tokens once and use them whenever you want. No recurring
                  charges or subscription commitments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Can I buy more tokens later?
                </h3>
                <p className="text-gray-600 mb-6">
                  Absolutely! You can purchase additional token packages at any
                  time. Tokens stack and never expire, so you can build up your
                  balance as needed.
                </p>

                <h3 className="font-semibold text-lg mb-3">
                  What if I run out of tokens?
                </h3>
                <p className="text-gray-600 mb-6">
                  You can still access and study all your existing flashcards.
                  You&apos;ll just need to purchase more tokens to generate new
                  content.
                </p>
              </div>
            </div>
          </div>

          <CTASection
            title="Ready to Start Learning?"
            description={`Begin with ${POLICIES.freeTokens} free tokens and experience the power of AI-enhanced language learning.`}
            buttonText={UI_TEXT.cta.getStartedFree}
            className="rounded-lg"
          />
        </div>
      </section>
    </main>
  );
}
