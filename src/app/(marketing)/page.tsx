import { WhatAreSpeechIslandsSection } from "@/components/WhatAreSpeechIslandsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TryItOutDemo } from "@/components/TryItOutDemo";
import { DemoErrorBoundary } from "@/components/DemoErrorBoundary";
import { SimpleFAQ } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQ_DATA, UI_TEXT, POLICIES } from "@/data/marketing";
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

      <section id="pricing" className="px-8 py-16 bg-accent/5">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            100% Free
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-balance mb-4">
            Start Learning for Free
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get {POLICIES.freeTokens.toLocaleString()} free tokens to generate
            AI-powered flashcards. No credit card required.
          </p>
          <CTASection buttonText={UI_TEXT.cta.getStartedFree} className="p-0" />
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
        description={`Join thousands of learners using AI-powered flashcards. Start with ${POLICIES.freeTokens.toLocaleString()} free tokens.`}
        buttonText={UI_TEXT.cta.startLearningFree}
      />
    </>
  );
}
