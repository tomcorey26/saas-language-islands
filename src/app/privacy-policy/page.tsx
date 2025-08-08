import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | Islands of Language",
  description: "Privacy Policy for Islands of Language - AI-powered language learning platform",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          <p className="text-center text-muted-foreground">
            Effective Date: January 1, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <div className="text-muted-foreground space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Personal Information:</h3>
                <p>• Name, email address, and other information you provide when creating an account</p>
                <p>• Payment information processed securely through Stripe (we do not store payment details)</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Usage Information:</h3>
                <p>• Learning progress, flashcard interactions, and study session data</p>
                <p>• Device information, IP address, browser type, and operating system</p>
                <p>• Pages visited, time spent on pages, and other analytics data</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Generated Content:</h3>
                <p>• AI-generated flashcards and learning materials you create</p>
                <p>• Custom decks and islands you organize</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <div className="text-muted-foreground space-y-2">
              <p>• Provide and maintain our language learning service</p>
              <p>• Process payments and manage your token balance</p>
              <p>• Personalize your learning experience with AI-generated content</p>
              <p>• Track your progress using spaced repetition algorithms</p>
              <p>• Send important service updates and communications</p>
              <p>• Improve our service through analytics and user feedback</p>
              <p>• Comply with legal obligations and prevent fraud</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
            <div className="text-muted-foreground space-y-3">
              <p>We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
              <div>
                <h3 className="font-semibold text-foreground">Service Providers:</h3>
                <p>• Clerk (authentication and user management)</p>
                <p>• Stripe (payment processing)</p>
                <p>• OpenAI (AI-powered content generation)</p>
                <p>• Vercel (hosting and analytics)</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Legal Requirements:</h3>
                <p>• When required by law or legal process</p>
                <p>• To protect our rights, property, or safety</p>
                <p>• To prevent fraud or security threats</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Cookies and Tracking</h2>
            <div className="text-muted-foreground space-y-2">
              <p>We use cookies and similar technologies to:</p>
              <p>• Maintain your login session</p>
              <p>• Remember your preferences and settings</p>
              <p>• Analyze site usage and performance</p>
              <p>• Provide targeted improvements to our service</p>
              <p>You can control cookies through your browser settings. See our Cookie Policy for more details.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Your Rights (GDPR/CCPA)</h2>
            <div className="text-muted-foreground space-y-2">
              <p>You have the right to:</p>
              <p>• Access your personal information we hold</p>
              <p>• Correct inaccurate or incomplete information</p>
              <p>• Delete your personal information (right to be forgotten)</p>
              <p>• Port your data to another service</p>
              <p>• Opt-out of certain data processing activities</p>
              <p>• Object to processing based on legitimate interests</p>
              <p>To exercise these rights, contact us at icongeneratorai@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide services. We will delete your information when you request account deletion or after a reasonable period of inactivity, subject to legal requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy (COPPA)</h2>
            <p className="text-muted-foreground">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without parental consent, we will delete such information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" above. Continued use of our service constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
              <a href="mailto:icongeneratorai@gmail.com" className="text-primary hover:underline">
                icongeneratorai@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">12. Business Information</h2>
            <p className="text-muted-foreground">
              Islands of Language is operated by Seibert Software Solutions, LLC.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}