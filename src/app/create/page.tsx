'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BookOpen,
  Briefcase,
  Heart,
  Globe,
  Send,
  Languages,
  Hash,
  Mail,
} from 'lucide-react';
import { generateIslands } from '@/server/ai/flashcards';
import {
  FlashCardRequestSchema,
  FlashCardResponseSchema,
} from '@/zod/flashCardSchemas';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import ReCAPTCHA from 'react-google-recaptcha';

export const LoadingSpinner = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState('language');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<
    z.infer<typeof FlashCardRequestSchema>
  >({
    language: '',
    name: '',
    occupation: '',
    cardsPerCategory: '5',
    interests: {
      reading: false,
      gaming: false,
      cooking: false,
      music: false,
      sports: false,
      art: false,
      technology: false,
      photography: false,
      travel: false,
      writing: false,
      dancing: false,
      gardening: false,
    },
    commonScenarios: {
      travel: false,
      dining: false,
      shopping: false,
      healthcare: false,
      smallTalk: false,
      emergencies: false,
      directions: false,
      culture: false,
    },
    email: '',
    recaptchaToken: '',
  });

  const [flashcards, setFlashcards] = useState<z.infer<
    typeof FlashCardResponseSchema
  > | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    category: keyof typeof formData,
    key: keyof (typeof formData)[typeof category]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]:
        typeof prev[category] === 'object'
          ? {
              ...prev[category],
              [key]: !prev[category][key],
            }
          : prev[category],
    }));
  };

  const handleNextStep = (step: string) => {
    setCurrentStep(step);
  };

  const handleGenerate = async () => {
    const data = await generateIslands(formData);
    setFlashcards(data.flashcards);
  };

  const handleCaptchaChange = (token: string | null) => {
    setFormData((prev) => ({ ...prev, recaptchaToken: token || '' }));
  };

  const handleSubmit = async () => {
    if (!formData.recaptchaToken) {
      alert('Please complete the CAPTCHA.');
      return;
    }
    setShowPreview(true);
    await handleGenerate();
  };

  if (showPreview) {
    if (!flashcards)
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner className="animate-spin" />
        </div>
      );

    const accordionItems = Object.entries(flashcards).map(([key, value]) =>
      value.length > 0 ? (
        <AccordionItem key={key} value={key}>
          <AccordionTrigger className="text-lg font-semibold">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {value.map((card, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{card.sentence}</div>
                  <div className="text-gray-600">{card.translation}</div>
                </div>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
      ) : null
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-800">
                Your Generated Flashcards
              </CardTitle>
              <CardDescription className="text-center">
                {formData.cardsPerCategory} cards per category in{' '}
                {formData.language}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {accordionItems}
              </Accordion>

              <Button
                className="w-full mt-6"
                onClick={() => setShowPreview(false)}
              >
                Back to Form
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-800">
              Personalized Language Flashcards
            </CardTitle>
            <CardDescription className="text-center">
              Let&apos;s create flashcards tailored to your interests and needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={currentStep}
              className="w-full"
              onValueChange={(value) => setCurrentStep(value)}
            >
              <TabsList className="grid w-full grid-cols-7 h-min">
                <TabsTrigger
                  value="language"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Languages className="h-4 w-4" />
                  <span>Language</span>
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Personal</span>
                </TabsTrigger>
                <TabsTrigger
                  value="work"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Work</span>
                </TabsTrigger>
                <TabsTrigger
                  value="interests"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Heart className="h-4 w-4" />
                  <span>Interests</span>
                </TabsTrigger>
                <TabsTrigger
                  value="scenarios"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Globe className="h-4 w-4" />
                  <span>Scenarios</span>
                </TabsTrigger>
                <TabsTrigger
                  value="count"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Hash className="h-4 w-4" />
                  <span>Count</span>
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Mail className="h-4 w-4" />
                  <span>Generate</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="language" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Select Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        handleInputChange('language', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep('personal')}
                    disabled={!formData.language}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder="Enter your name"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep('work')}
                    disabled={!formData.name}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="occupation">Your Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) =>
                        handleInputChange('occupation', e.target.value)
                      }
                      placeholder="Enter your occupation"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep('interests')}
                    disabled={!formData.occupation}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="interests" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <Label>Select your interests and hobbies:</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries({
                      reading: 'Reading',
                      gaming: 'Gaming',
                      cooking: 'Cooking',
                      music: 'Music',
                      sports: 'Sports',
                      art: 'Art',
                      technology: 'Technology',
                      photography: 'Photography',
                      travel: 'Travel',
                      writing: 'Writing',
                      dancing: 'Dancing',
                      gardening: 'Gardening',
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={
                            formData.interests[
                              key as keyof typeof formData.interests
                            ]
                          }
                          onCheckedChange={() =>
                            handleCheckboxChange('interests', key)
                          }
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep('scenarios')}
                    disabled={!Object.values(formData.interests).some(Boolean)}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <Label>
                    Select common scenarios you&apos;d like to learn:
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries({
                      travel: 'Travel & Transportation',
                      dining: 'Restaurants & Dining',
                      shopping: 'Shopping & Services',
                      healthcare: 'Healthcare & Emergencies',
                      smallTalk: 'Small Talk & Greetings',
                      emergencies: 'Emergency Situations',
                      directions: 'Asking for Directions',
                      culture: 'Cultural Topics & Customs',
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={
                            formData.commonScenarios[
                              key as keyof typeof formData.commonScenarios
                            ]
                          }
                          onCheckedChange={() =>
                            handleCheckboxChange('commonScenarios', key)
                          }
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep('count')}
                    disabled={
                      !Object.values(formData.commonScenarios).some(Boolean)
                    }
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="count" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardsPerCategory">
                      How many flashcards per category?
                    </Label>
                    <Select
                      value={formData.cardsPerCategory}
                      onValueChange={(value) =>
                        handleInputChange('cardsPerCategory', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose number of cards" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 cards</SelectItem>
                        <SelectItem value="10">10 cards</SelectItem>
                        <SelectItem value="15">15 cards</SelectItem>
                        <SelectItem value="20">20 cards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep('email')}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={handleCaptchaChange}
                  />
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSubmit}
                    disabled={!formData.email || !formData.recaptchaToken}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Generate Flashcards
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
