import { Metadata } from "next";
import {
  COMPANY,
  CONTACT,
  META_DESCRIPTIONS,
  POLICIES,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: `Privacy Policy - ${COMPANY.name}`,
  description: META_DESCRIPTIONS.privacy,
};

export default function PrivacyPage() {
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-600">Last updated: September 2025</p>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with Speech Islands, we collect
              information such as:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Email address</li>
              <li className="text-gray-700 list-disc">Name (optional)</li>
              <li className="text-gray-700 list-disc">Profile information you choose to provide</li>
              <li className="text-gray-700 list-disc">Payment information (processed securely through Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Usage Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We automatically collect information about how you use our
              service:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Flashcard study sessions and performance data</li>
              <li className="text-gray-700 list-disc">Language learning progress and statistics</li>
              <li className="text-gray-700 list-disc">Features used and time spent on the platform</li>
              <li className="text-gray-700 list-disc">Device information and browser type</li>
              <li className="text-gray-700 list-disc">IP address and approximate location</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">2. How We Use Your Information</h2>

            <p className="text-gray-700 leading-relaxed">We use your information to:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Provide and improve our language learning service</li>
              <li className="text-gray-700 list-disc">Personalize your learning experience and content</li>
              <li className="text-gray-700 list-disc">Process payments and manage your account</li>
              <li className="text-gray-700 list-disc">Send important updates about your account or our service</li>
              <li className="text-gray-700 list-disc">Respond to your questions and provide customer support</li>
              <li className="text-gray-700 list-disc">Analyze usage patterns to improve our platform</li>
              <li className="text-gray-700 list-disc">Ensure the security and integrity of our service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">3. Information Sharing</h2>

            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or rent your personal information to third
              parties. We only share your information in the following limited
              circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Providers</h3>
            <p className="text-gray-700 leading-relaxed">
              We work with trusted third-party service providers who help us
              operate our platform:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">
                <strong>Clerk:</strong> Authentication and user management
              </li>
              <li className="text-gray-700 list-disc">
                <strong>Stripe:</strong> Payment processing
              </li>
              <li className="text-gray-700 list-disc">
                <strong>OpenAI:</strong> AI-powered content generation
              </li>
              <li className="text-gray-700 list-disc">
                <strong>Vercel:</strong> Hosting and analytics
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law or to protect
              our rights, property, or safety, or that of our users or others.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">4. Data Security</h2>

            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your
              personal information:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Encryption in transit and at rest</li>
              <li className="text-gray-700 list-disc">Regular security assessments and updates</li>
              <li className="text-gray-700 list-disc">Access controls and authentication</li>
              <li className="text-gray-700 list-disc">Secure payment processing through PCI-compliant providers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">5. Your Rights and Choices</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Account Information</h3>
            <p className="text-gray-700 leading-relaxed">
              You can update your account information at any time through your
              dashboard.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Deletion</h3>
            <p className="text-gray-700 leading-relaxed">
              You can request deletion of your account and associated data by
              contacting us. Some information may be retained for legal or
              business purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Marketing Communications</h3>
            <p className="text-gray-700 leading-relaxed">
              You can opt out of marketing emails through the unsubscribe link
              in any email or by updating your preferences in your account
              settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">6. Cookies and Tracking</h2>

            <p className="text-gray-700 leading-relaxed">We use cookies and similar technologies to:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Remember your preferences and settings</li>
              <li className="text-gray-700 list-disc">Analyze how our service is used</li>
              <li className="text-gray-700 list-disc">Provide personalized content and features</li>
              <li className="text-gray-700 list-disc">Ensure security and prevent fraud</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings, though this
              may affect the functionality of our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">7. International Data Transfers</h2>

            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your data in accordance with this privacy policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">8. Children&apos;s Privacy</h2>

            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under {POLICIES.minAge}{" "}
              years of age. We do not knowingly collect personal information
              from children under {POLICIES.minAge}. If you believe we have
              collected information from a child under {POLICIES.minAge}, please
              contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">9. Changes to This Policy</h2>

            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">10. Contact Us</h2>

            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this privacy policy or our data
              practices, please contact us:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Email: {CONTACT.privacy}</li>
              <li className="text-gray-700 list-disc">
                Contact form:{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  /contact
                </a>
              </li>
            </ul>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                GDPR and CCPA Compliance
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                We comply with applicable data protection laws including GDPR
                and CCPA. If you are a resident of the EU or California, you
                have additional rights regarding your personal information.
                Contact us for more information about exercising these rights.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
