import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Refund Policy | Islands of Language",
  description: "Refund Policy for Islands of Language - AI-powered language learning platform",
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Refund Policy</CardTitle>
          <p className="text-center text-muted-foreground">
            Effective Date: January 1, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Token Purchase Refunds</h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Due to the instant, digital nature of our AI-powered flashcard generation service, all token purchases are generally final and non-refundable. Once tokens are used to generate content, they cannot be refunded.
              </p>
              <p>
                <strong>However, we may provide refunds in the following exceptional circumstances:</strong>
              </p>
              <p>• Technical issues that prevent you from using purchased tokens</p>
              <p>• Billing errors or unauthorized charges</p>
              <p>• Service outages that significantly impact your ability to use tokens</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Refund Request Process</h2>
            <div className="text-muted-foreground space-y-2">
              <p>To request a refund, please contact us within 7 days of your purchase:</p>
              <p>• Email: <a href="mailto:icongeneratorai@gmail.com" className="text-primary hover:underline">icongeneratorai@gmail.com</a></p>
              <p>• Include your order number or transaction ID</p>
              <p>• Describe the reason for your refund request</p>
              <p>• Provide any relevant details or screenshots</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Refund Processing</h2>
            <div className="text-muted-foreground space-y-2">
              <p>If your refund is approved:</p>
              <p>• Refunds will be processed to the original payment method</p>
              <p>• Processing time is typically 5-10 business days</p>
              <p>• You will receive email confirmation when the refund is processed</p>
              <p>• Any unused tokens associated with the refunded purchase will be removed from your account</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Partial Refunds</h2>
            <p className="text-muted-foreground">
              In cases where only some tokens from a purchase were affected by technical issues, we may offer partial refunds based on the unused token balance at the time of the issue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Chargebacks</h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Before initiating a chargeback with your bank or credit card company, please contact us directly to resolve any issues. Chargebacks can result in:
              </p>
              <p>• Immediate suspension of your account</p>
              <p>• Additional fees charged by payment processors</p>
              <p>• Permanent ban from using our service</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Service Credits</h2>
            <p className="text-muted-foreground">
              In lieu of monetary refunds, we may offer service credits (additional tokens) for technical issues or service disruptions. Service credits do not expire and can be used for future AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Account Cancellation</h2>
            <div className="text-muted-foreground space-y-2">
              <p>You may cancel your account at any time:</p>
              <p>• Cancellation does not entitle you to a refund of unused tokens</p>
              <p>• You can continue to use purchased tokens until they are depleted</p>
              <p>• Account data will be retained according to our Privacy Policy</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Fraud Protection</h2>
            <p className="text-muted-foreground">
              We reserve the right to refuse refunds for accounts suspected of fraudulent activity, including but not limited to: creating multiple accounts to abuse free tokens, using stolen payment methods, or violating our Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Third-Party Payment Processors</h2>
            <p className="text-muted-foreground">
              All payments are processed through Stripe. While we handle refund requests, the actual processing is subject to Stripe's policies and procedures. For more information, see <a href="https://stripe.com/refunds" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stripe's refund policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Refund Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our service after changes constitutes acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
            <p className="text-muted-foreground">
              For refund requests or questions about this policy, please contact us at{" "}
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