import { WhatAreSpeechIslandsSection } from "@/components/WhatAreSpeechIslandsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TryItOutDemo } from "@/components/TryItOutDemo";
import { DemoErrorBoundary } from "@/components/DemoErrorBoundary";
import { subscriptionTiersInOrder } from "@/data/paymentTiers";
import { PricingCard } from "@/components/marketing/PricingCard";
import { SimpleFAQ } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQ_DATA, UI_TEXT } from "@/data/marketing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <>
      <DemoErrorBoundary>
        <TryItOutDemo />
      </DemoErrorBoundary>
      <WhatAreSpeechIslandsSection />
      <FeaturesSection />
      <TestimonialsSection />
      {/* <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container px-8 md:px-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              ⭐ Trusted by {POLICIES.userCount} language learners
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-8">
              Join thousands mastering new languages
            </h2>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-4xl">🌍</div>
              <div className="text-4xl">🎓</div>
              <div className="text-4xl">💬</div>
              <div className="text-4xl">🚀</div>
              <div className="text-4xl">✨</div>
            </div>
          </div>
        </div>
      </section> */}

      <section id="pricing" className="px-8 py-16 bg-accent/5">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-balance mb-4">
              Choose Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save time and money from expensive tutors and courses. Start with
              tokens, generate unlimited flashcards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiersInOrder.map((tier) => (
              <PricingCard
                {...tier}
                key={tier.name}
                mostPopular={tier.name === "2000 Generations"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <SimpleFAQ
            faqs={FAQ_DATA.general.slice(0, 4)}
            className="grid gap-6"
          />
        </div>
      </section>

      <CTASection
        title="Ready to Master a New Language?"
        description="Join thousands of learners using AI-powered flashcards to achieve fluency faster."
        buttonText={UI_TEXT.cta.startLearningFree}
      />
    </>
  );
}
