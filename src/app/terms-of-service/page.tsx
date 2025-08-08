import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | Islands of Language",
  description: "Terms of Service for Islands of Language - AI-powered language learning platform",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          <p className="text-center text-muted-foreground">
            Effective Date: January 1, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Islands of Language ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Islands of Language is an AI-powered language learning platform that provides flashcards organized into "islands" and "decks" using spaced repetition algorithms. Users can purchase tokens to generate AI-powered flashcards for various language learning scenarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
            <div className="text-muted-foreground space-y-2">
              <p>• You must provide accurate and complete information when creating an account</p>
              <p>• You are responsible for maintaining the security of your account credentials</p>
              <p>• You must notify us immediately of any unauthorized use of your account</p>
              <p>• You must be at least 13 years old to use this service</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Payment and Tokens</h2>
            <div className="text-muted-foreground space-y-2">
              <p>• Tokens are purchased through Stripe payment processing</p>
              <p>• Tokens are non-refundable except as outlined in our Refund Policy</p>
              <p>• Pricing is subject to change with 30 days notice</p>
              <p>• Unused tokens do not expire but may be subject to future policy changes</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. User Content and Conduct</h2>
            <div className="text-muted-foreground space-y-2">
              <p>• You retain ownership of content you create using our service</p>
              <p>• You grant us a license to use your content to provide and improve our service</p>
              <p>• You agree not to use the service for any illegal or unauthorized purpose</p>
              <p>• You agree not to violate any laws in your jurisdiction</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The service and its original content, features, and functionality are and will remain the exclusive property of Seibert Software Solutions, LLC and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall Seibert Software Solutions, LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be interpreted and governed by the laws of the State of Delaware, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:icongeneratorai@gmail.com" className="text-primary hover:underline">
                icongeneratorai@gmail.com
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}