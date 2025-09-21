import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { COMPANY, CONTACT } from "@/data/marketing";

export const metadata: Metadata = {
  title: `Feature Request Submitted - ${COMPANY.name}`,
  description: "Your feature request has been successfully submitted.",
};

export default function FeatureRequestSuccessPage() {
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Request Submitted!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for your feature request. We&apos;ve received it and
              will review it carefully.
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailIcon className="w-6 h-6" />
                  Stay in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Have questions about your request or want to discuss it
                  further?
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Email Support</p>
                    <a
                      href={`mailto:${CONTACT.support}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {CONTACT.support}
                    </a>
                  </div>
                  {/* <div>
                    <p className="font-medium text-sm">Response Time</p>
                    <p className="text-gray-600 text-sm">
                      We typically respond within 24 hours
                    </p>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/contact" className="flex items-center gap-2">
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Contact
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Your request has been saved and we&apos;ll be in touch soon!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
