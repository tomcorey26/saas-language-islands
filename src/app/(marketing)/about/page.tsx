import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/marketing/CTASection";
import { COMPANY, META_DESCRIPTIONS, UI_TEXT } from "@/data/marketing";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: `About - ${COMPANY.name}`,
  description: META_DESCRIPTIONS.about,
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About {COMPANY.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re on a mission to make language learning more effective,
              accessible, and enjoyable through the power of AI and proven
              learning science.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                {COMPANY.name} was born from the frustration of traditional
                language learning methods. As language learners ourselves, we
                experienced the disconnect between memorizing vocabulary lists
                and actually speaking with confidence.
              </p>
              <p className="text-gray-600 mb-4">
                We discovered that the key to fluency isn&apos;t just knowing
                words—it&apos;s understanding how they fit together in real
                conversations. That&apos;s why we created &quot;islands&quot; of
                speech: contextual groups of phrases and sentences that actually
                matter.
              </p>
              <p className="text-gray-600">
                By combining AI-powered content generation with
                scientifically-proven spaced repetition, we&apos;ve created a
                learning experience that adapts to you and accelerates your path
                to fluency.
              </p>
            </div>
            <div className="text-6xl text-center">
              <BrandLogo size={526} />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-semibold text-lg mb-2">
                    Effectiveness First
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Every feature is designed based on learning science and real
                    user outcomes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                  <p className="text-gray-600 text-sm">
                    Quality language education should be available to everyone,
                    everywhere.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                  <p className="text-gray-600 text-sm">
                    We continuously evolve our platform using the latest AI and
                    learning technologies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              The Science Behind Speech Islands
            </h2>
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    🧠 Spaced Repetition
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Our algorithm shows you content just before you&apos;re
                    about to forget it, maximizing retention and minimizing
                    study time.
                  </p>
                  <h3 className="font-semibold text-lg mb-3">
                    🎭 Contextual Learning
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Instead of isolated words, you learn phrases in meaningful
                    contexts that prepare you for real conversations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    🤖 AI Personalization
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Our AI creates content tailored to your interests, learning
                    style, and goals, making every session relevant and
                    engaging.
                  </p>
                  <h3 className="font-semibold text-lg mb-3">
                    📊 Progress Tracking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Detailed analytics help you understand your progress and
                    identify areas that need more focus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CTASection
            title="Join Our Language Learning Revolution"
            description={`Experience the future of language learning with ${COMPANY.name}.`}
            buttonText={UI_TEXT.cta.startLearning}
            className="rounded-lg"
          />
        </div>
      </section>
    </main>
  );
}
