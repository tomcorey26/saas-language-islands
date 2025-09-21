import { Metadata } from "next";
import {
  COMPANY,
  CONTACT,
  FAQ_DATA,
  META_DESCRIPTIONS,
  POLICIES,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: `Terms of Service - ${COMPANY.name}`,
  description: META_DESCRIPTIONS.terms,
};

export default function TermsPage() {
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-gray-600">Last updated: September 2025</p>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">1. Acceptance of Terms</h2>

            <p className="text-gray-700 leading-relaxed">
              By accessing or using {COMPANY.name} (&quot;the Service&quot;),
              you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, you may
              not use the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">2. Description of Service</h2>

            <p className="text-gray-700 leading-relaxed">
              {COMPANY.name} is an AI-powered language learning platform that
              provides:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">
                AI-generated flashcards organized into thematic
                &quot;islands&quot;
              </li>
              <li className="text-gray-700 list-disc">Spaced repetition learning algorithms</li>
              <li className="text-gray-700 list-disc">Progress tracking and analytics</li>
              <li className="text-gray-700 list-disc">Multi-language support</li>
              <li className="text-gray-700 list-disc">Token-based content generation system</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Account Creation</h3>
            <p className="text-gray-700 leading-relaxed">
              To use certain features of the Service, you must create an
              account. You agree to:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Provide accurate and complete information</li>
              <li className="text-gray-700 list-disc">Keep your account information updated</li>
              <li className="text-gray-700 list-disc">Maintain the security of your account credentials</li>
              <li className="text-gray-700 list-disc">Be responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Account Eligibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You must be at least {POLICIES.minAge} years old to create an
              account. Users under {POLICIES.minAgeWithParentalConsent} must
              have parental consent.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">4. Token System and Payments</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Token Purchase</h3>
            <p className="text-gray-700 leading-relaxed">
              Tokens are virtual credits used to generate AI-powered flashcards.
              By purchasing tokens, you agree that:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Tokens have no monetary value outside the Service</li>
              <li className="text-gray-700 list-disc">
                Tokens are non-transferable and non-refundable except as stated
                in our refund policy
              </li>
              <li className="text-gray-700 list-disc">Tokens do not expire</li>
              <li className="text-gray-700 list-disc">We may modify token pricing with 30 days notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Refund Policy</h3>
            <p className="text-gray-700 leading-relaxed">{FAQ_DATA.refundPolicy}</p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">5. Acceptable Use</h2>

            <p className="text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Use the Service for any illegal or unauthorized purpose</li>
              <li className="text-gray-700 list-disc">
                Generate content that is harmful, offensive, or violates
                others&apos; rights
              </li>
              <li className="text-gray-700 list-disc">Attempt to reverse engineer, hack, or exploit the Service</li>
              <li className="text-gray-700 list-disc">Share your account credentials with others</li>
              <li className="text-gray-700 list-disc">
                Use automated tools to access the Service without permission
              </li>
              <li className="text-gray-700 list-disc">Interfere with or disrupt the Service or its servers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">6. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Our Content</h3>
            <p className="text-gray-700 leading-relaxed">
              The Service, including its design, features, and underlying
              technology, is owned by Speech Islands and protected by
              intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">User-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of content you create, but grant us a license
              to use it to provide and improve the Service. This includes
              flashcards, progress data, and feedback you provide.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">AI-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed">
              Flashcards generated by our AI belong to you for personal use. You
              may not redistribute or commercialize this content without
              permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">7. Privacy and Data</h2>

            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">8. Service Availability</h2>

            <p className="text-gray-700 leading-relaxed">We strive to provide reliable service but cannot guarantee:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Uninterrupted access to the Service</li>
              <li className="text-gray-700 list-disc">Error-free operation</li>
              <li className="text-gray-700 list-disc">Compatibility with all devices or browsers</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              We may temporarily suspend the Service for maintenance, updates,
              or other operational reasons with reasonable notice when possible.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">9. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Termination by You</h3>
            <p className="text-gray-700 leading-relaxed">
              You may terminate your account at any time by contacting support.
              Unused tokens may be eligible for refund within our refund policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Termination by Us</h3>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your account if you violate these
              Terms or engage in behavior that harms the Service or other users.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">10. Disclaimers and Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Educational Tool</h3>
            <p className="text-gray-700 leading-relaxed">
              Speech Islands is an educational tool. We make no guarantees about
              learning outcomes, fluency achievement, or academic success.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">AI-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed">
              AI-generated content may contain errors or inaccuracies. Always
              verify important information with authoritative sources.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Speech Islands shall not
              be liable for any indirect, incidental, special, or consequential
              damages arising from your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">11. Indemnification</h2>

            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless Speech Islands from any
              claims, damages, or expenses arising from your use of the Service
              or violation of these Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">12. Governing Law</h2>

            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of Rhode Island, United States. Any
              disputes will be resolved in the courts of Rhode Island, United States.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">13. Changes to Terms</h2>

            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. We will notify users
              of material changes by posting the updated Terms and updating the
              &quot;Last updated&quot; date. Continued use of the Service after
              changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">14. Contact Information</h2>

            <p className="text-gray-700 leading-relaxed">For questions about these Terms, please contact us:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 list-disc">Email: {CONTACT.legal}</li>
              <li className="text-gray-700 list-disc">
                Contact form:{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  /contact
                </a>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">15. Severability</h2>

            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will continue in full force and effect.
            </p>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-2">
                Questions About These Terms?
              </h3>
              <p className="text-sm text-gray-600">
                If you have any questions about these Terms of Service, please
                don&apos;t hesitate to contact our support team. We&apos;re here
                to help clarify any aspect of our service agreement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
