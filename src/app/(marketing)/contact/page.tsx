import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailIcon, HelpCircleIcon, LightbulbIcon } from "lucide-react";
import { submitFeatureRequest } from "@/server/actions/featureRequest";
import { ConditionalStatusMessage } from "@/components/marketing/StatusMessage";
import {
  COMPANY,
  CONTACT,
  FAQ_DATA,
  META_DESCRIPTIONS,
  POLICIES,
  FEATURES,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: `Contact Us - ${COMPANY.name}`,
  description: META_DESCRIPTIONS.contact,
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="pt-20">
      <section className="py-16 px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hey I&apos;m{" "}
              <a
                href="https://tomcorey.lol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Tom
              </a>
              . The dev behind speech islands. Have a question, feedback, or
              need help? I&apos;d love to hear from you. I&apos;m here to
              support your language learning journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MailIcon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Email Support (Tom)</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`mailto:${CONTACT.support}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {CONTACT.support}
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <HelpCircleIcon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Help Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse our knowledge base for quick answers.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/faq">Visit FAQ</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <LightbulbIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Feature Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Have an idea to improve Speech Islands?
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#feature-request">Submit Request</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    How quickly do tokens get added to my account?
                  </h3>
                  <p className="text-gray-600">
                    Tokens are added to your account immediately after
                    successful payment processing, usually within seconds.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Can I get a refund if I&apos;m not satisfied?
                  </h3>
                  <p className="text-gray-600">{FAQ_DATA.refundPolicy}</p>
                </div>
                {/* <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Do you offer educational discounts?
                  </h3>
                  <p className="text-gray-600">
                    Yes! We provide special pricing for students, teachers, and
                    educational institutions. Contact us with your .edu email
                    for more information.
                  </p>
                </div> */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Which languages do you support?
                  </h3>
                  <p className="text-gray-600">
                    We support {POLICIES.languageCount}+ languages including
                    Spanish, French, German, Italian, Portuguese, Japanese,
                    Korean, Mandarin, Arabic, Hindi, and many more.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Is there a mobile app?
                  </h3>
                  <p className="text-gray-600">
                    Our web app works great on mobile browsers and is fully
                    responsive. If people like it enough, I may build a native
                    app in the future.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-2">
                  Business Inquiries
                </h3>
                <p className="text-gray-600 mb-3">
                  Interested in Speech Islands for your organization or have a
                  partnership proposal?
                </p>
                <a
                  href={`mailto:${CONTACT.business}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {CONTACT.business}
                </a>
              </div>
            </div>

            {/* Feature Request Section */}
            <div id="feature-request">
              <h2 className="text-3xl font-bold mb-6">Feature Request</h2>

              <ConditionalStatusMessage
                searchParams={params}
                successTitle="Request Submitted!"
                successMessage="Thank you for your feature request. We'll review it and get back to you soon."
                errorTitle="Submission Failed"
                errorMessage="Sorry, there was an error submitting your request. Please try again."
                className="mb-8"
              />

              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Idea</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={submitFeatureRequest} className="space-y-6">
                      <div>
                        <Label htmlFor="title">Feature Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., Offline study mode"
                          required
                          maxLength={255}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe your feature idea in detail. What problem would it solve? How would it work?"
                          rows={6}
                          required
                          minLength={10}
                          maxLength={2000}
                          className="resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          10-2000 characters
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="userEmail">Your Email *</Label>
                        <Input
                          id="userEmail"
                          name="userEmail"
                          type="email"
                          placeholder="your@email.com"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          We&apos;ll use this to follow up on your request
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="userName">Your Name</Label>
                        <Input
                          id="userName"
                          name="userName"
                          placeholder="Your name (optional)"
                          maxLength={255}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Submit Feature Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">💡</span>
                        Tips for Great Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1">Be Specific</h4>
                        <p className="text-sm text-gray-600">
                          Clearly describe what you want and why it would be useful.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Explain the Problem</h4>
                        <p className="text-sm text-gray-600">
                          Help us understand what challenge you&apos;re facing in
                          your language learning.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Consider Other Users</h4>
                        <p className="text-sm text-gray-600">
                          Think about how your idea could benefit the broader Speech
                          Islands community.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        Popular Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {FEATURES.popular.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className={`w-2 h-2 bg-${feature.color}-500 rounded-full`}
                          ></div>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">⏱️</span>
                        What Happens Next?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Review</p>
                          <p>
                            Our team reviews your request within{" "}
                            {POLICIES.reviewTimeHours} hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Prioritize</p>
                          <p>We assess impact and feasibility for our roadmap</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Update</p>
                          <p>
                            You&apos;ll receive updates on your request&apos;s
                            status
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
