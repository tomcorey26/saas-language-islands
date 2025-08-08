import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Shield, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us | Islands of Language",
  description: "Get in touch with Islands of Language support team for help with your language learning journey",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're here to help with your language learning journey. Reach out to us for support, feedback, or any questions you might have.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              General Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              For general questions, technical support, or account issues.
            </p>
            <Button asChild className="w-full">
              <a href="mailto:icongeneratorai@gmail.com?subject=Support%20Request%20-%20Islands%20of%20Language">
                Email Support
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Billing & Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Questions about payments, token purchases, or refund requests.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:icongeneratorai@gmail.com?subject=Billing%20Inquiry%20-%20Islands%20of%20Language">
                Billing Support
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Privacy & Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Data privacy requests, legal inquiries, or terms of service questions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:icongeneratorai@gmail.com?subject=Privacy%2FLegal%20Inquiry%20-%20Islands%20of%20Language">
                Legal Contact
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-purple-500" />
              Feature Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Suggestions for new features or improvements to our platform.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:icongeneratorai@gmail.com?subject=Feature%20Request%20-%20Islands%20of%20Language">
                Send Suggestion
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Time & Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Expected Response Time</h3>
            <p className="text-muted-foreground">
              We typically respond to all inquiries within 24-48 hours during business days. For urgent billing or technical issues, we'll prioritize your request.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Business Details</h3>
            <div className="text-muted-foreground space-y-1">
              <p><strong>Company:</strong> Seibert Software Solutions, LLC</p>
              <p><strong>Email:</strong> <a href="mailto:icongeneratorai@gmail.com" className="text-primary hover:underline">icongeneratorai@gmail.com</a></p>
              <p><strong>Website:</strong> <a href="https://webdevcody.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">webdevcody.com</a></p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Before You Contact Us</h3>
            <div className="text-muted-foreground space-y-1">
              <p>• Check our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> for data-related questions</p>
              <p>• Review our <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a> for account and usage policies</p>
              <p>• See our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a> for billing questions</p>
              <p>• Try refreshing your browser or logging out/in for technical issues</p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-foreground">When Contacting Us, Please Include:</h3>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>• Your account email address</p>
              <p>• Clear description of the issue or question</p>
              <p>• Screenshots if relevant (for technical issues)</p>
              <p>• Order/transaction ID (for billing inquiries)</p>
              <p>• Browser and device information (for technical issues)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}