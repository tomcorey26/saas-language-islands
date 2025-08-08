import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Cookie Policy | Islands of Language",
  description: "Cookie Policy for Islands of Language - AI-powered language learning platform",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Cookie Policy</CardTitle>
          <p className="text-center text-muted-foreground">
            Effective Date: January 1, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you logged in, and analyzing how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Cookies</h2>
            <div className="text-muted-foreground space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Essential Cookies:</h3>
                <p>• Authentication and session management (via Clerk)</p>
                <p>• Security and fraud prevention</p>
                <p>• Basic site functionality</p>
                <p>• These cookies are necessary for the site to work and cannot be disabled</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Analytics Cookies:</h3>
                <p>• Website usage statistics (via Vercel Analytics)</p>
                <p>• Performance monitoring</p>
                <p>• User behavior patterns to improve our service</p>
                <p>• These cookies help us understand how users interact with our site</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Preference Cookies:</h3>
                <p>• Language settings and learning preferences</p>
                <p>• UI customizations and display settings</p>
                <p>• Theme preferences (if implemented)</p>
                <p>• These cookies remember your choices to personalize your experience</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Third-Party Cookies</h2>
            <div className="text-muted-foreground space-y-3">
              <p>We use third-party services that may set their own cookies:</p>
              <div>
                <h3 className="font-semibold text-foreground">Clerk (Authentication):</h3>
                <p>• Manages user sessions and authentication</p>
                <p>• See <a href="https://clerk.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Clerk's Privacy Policy</a></p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Stripe (Payments):</h3>
                <p>• Processes payments securely</p>
                <p>• Fraud detection and prevention</p>
                <p>• See <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stripe's Privacy Policy</a></p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vercel (Analytics):</h3>
                <p>• Website performance and usage analytics</p>
                <p>• See <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a></p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Cookie Duration</h2>
            <div className="text-muted-foreground space-y-2">
              <p><strong>Session Cookies:</strong> Deleted when you close your browser</p>
              <p><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</p>
              <p><strong>Authentication Cookies:</strong> Typically last 30 days or until you log out</p>
              <p><strong>Preference Cookies:</strong> Last up to 1 year to remember your settings</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Managing Cookies</h2>
            <div className="text-muted-foreground space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Browser Settings:</h3>
                <p>You can control cookies through your browser settings:</p>
                <p>• <a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a></p>
                <p>• <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a></p>
                <p>• <a href="https://support.apple.com/en-us/HT201265" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></p>
                <p>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Edge</a></p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Important Note:</h3>
                <p>Disabling essential cookies may impact site functionality, including the ability to log in or make purchases.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. GDPR Compliance (EU Users)</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Under GDPR, you have the right to:</p>
              <p>• Be informed about cookies before they are set</p>
              <p>• Give or withdraw consent for non-essential cookies</p>
              <p>• Access information about cookies we use</p>
              <p>EU users will see a cookie consent banner on their first visit.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Do Not Track</h2>
            <p className="text-muted-foreground">
              Our website does not currently respond to "Do Not Track" signals from browsers, as there is no standard interpretation of such signals. However, you can use the browser controls mentioned above to manage cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Mobile Devices</h2>
            <p className="text-muted-foreground">
              If you access our service through a mobile device, similar tracking technologies may be used. You can control these through your device's privacy settings or by uninstalling the app if applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy to reflect changes in our practices or applicable laws. We will post any changes on this page and update the effective date above.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, please contact us at{" "}
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