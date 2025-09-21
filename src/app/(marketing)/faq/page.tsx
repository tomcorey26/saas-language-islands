import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import {
  COMPANY,
  META_DESCRIPTIONS,
  FAQ_DATA,
  UI_TEXT,
  CONTACT,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: `FAQ - ${COMPANY.name}`,
  description: META_DESCRIPTIONS.faq,
};

export default function FAQPage() {
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to know about {COMPANY.name} and language
              learning with AI.
            </p>
          </div>

          <div className="space-y-12">
            <FAQSection
              title="General Questions"
              icon="🌟"
              faqs={FAQ_DATA.general}
            />

            <FAQSection
              title="Technical Questions"
              icon="⚙️"
              faqs={FAQ_DATA.technical}
            />

            <FAQSection
              title="Billing & Pricing"
              icon="💳"
              faqs={FAQ_DATA.billing}
            />
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Our support
                team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`mailto:${CONTACT.support}`}>Email Us</a>
                </Button>
              </div>
            </div>
          </div>

          <CTASection
            title="Ready to Start Learning?"
            description={`Join thousands of learners mastering new languages with ${COMPANY.name}.`}
            buttonText={UI_TEXT.cta.tryFree}
            className="mt-16 rounded-lg"
          />
        </div>
      </section>
    </main>
  );
}
