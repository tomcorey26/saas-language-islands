"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Briefcase,
  Heart,
  Globe,
  Send,
  Languages,
  Hash,
  Sparkles,
} from "lucide-react";
import { generateIslands } from "@/server/ai/flashcards";
import ReCAPTCHA from "react-google-recaptcha";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  CreateWorldRequest,
  CreateWorldResponse,
} from "@/zod/contracts/world.schema";
import { SignUpButton } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = CreateWorldRequest;

type Step =
  | "language"
  | "personal"
  | "work"
  | "interests"
  | "scenarios"
  | "count"
  | "generate";

const INTERESTS_FORM_LABELS: Record<keyof Inputs["interests"], string> = {
  reading: "Reading",
  gaming: "Gaming",
  cooking: "Cooking",
  music: "Music",
  sports: "Sports",
  art: "Art",
  technology: "Technology",
  photography: "Photography",
  travel: "Travel",
  writing: "Writing",
  dancing: "Dancing",
  gardening: "Gardening",
};

const SCENARIOS_FORM_LABELS: Record<keyof Inputs["commonScenarios"], string> = {
  travel: "Travel",
  dining: "Dining",
  shopping: "Shopping",
  healthcare: "Healthcare",
  smallTalk: "Small Talk",
  emergencies: "Emergencies",
  directions: "Directions",
  culture: "Culture",
};

// TODO: Use the Shadcn form component to make the form
// TODO: Add validation
// TODO: Add a loading state

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<Step>("language");
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      language: "spanish",
      name: "",
      occupation: "",
      cardsPerCategory: "5",
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
      recaptchaToken: "",
    },
  });

  const [flashcards, setFlashcards] = useState<
    CreateWorldResponse["flashcards"] | null
  >(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const responseData = await generateIslands(data);
    setFlashcards(responseData.flashcards);
  };

  const handleNextStep = (step: Step) => {
    setCurrentStep(step);
  };

  const formValues = watch();

  const handleCaptchaChange = (token: string | null) => {
    setValue("recaptchaToken", token || "");
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
                {formValues.cardsPerCategory} cards per category in{" "}
                {formValues.language}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {accordionItems}
              </Accordion>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPreview(false)}
                >
                  Back to Form
                </Button>
                <SignUpButton>
                  <Button className="w-full">Study Deck</Button>
                </SignUpButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <form
      className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
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
              onValueChange={(value) => setCurrentStep(value as Step)}
            >
              <TabsList className="grid w-full grid-cols-7 h-min">
                <TabsTrigger
                  value="language"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden md:inline">Language</span>
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden md:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger
                  value="work"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden md:inline">Work</span>
                </TabsTrigger>
                <TabsTrigger
                  value="interests"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden md:inline">Interests</span>
                </TabsTrigger>
                <TabsTrigger
                  value="scenarios"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline">Scenarios</span>
                </TabsTrigger>
                <TabsTrigger
                  value="count"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Hash className="h-4 w-4" />
                  <span className="hidden md:inline">Count</span>
                </TabsTrigger>
                <TabsTrigger
                  value="generate"
                  className="flex flex-col items-center gap-2 data-[state=active]:bg-blue-100"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden md:inline">Generate</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="language" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Select Language</Label>
                    <Select
                      value={formValues.language}
                      onValueChange={(value) => setValue("language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spanish">Spanish 🇪🇸</SelectItem>
                        <SelectItem value="french">French 🇫🇷</SelectItem>
                        <SelectItem value="german">German 🇩🇪</SelectItem>
                        <SelectItem value="italian">Italian 🇮🇹</SelectItem>
                        <SelectItem value="portuguese">
                          Portuguese 🇵🇹
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep("personal")}
                    disabled={!formValues.language}
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
                      {...register("name")}
                      placeholder="Enter your name"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep("work")}
                    disabled={!formValues.name}
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
                      {...register("occupation")}
                      placeholder="Enter your occupation"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep("interests")}
                    disabled={!formValues.occupation}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="interests" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <Label>Select your interests and hobbies:</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      Object.keys(formValues.interests) as Array<
                        keyof typeof formValues.interests
                      >
                    ).map((key) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={formValues.interests[key]}
                          onCheckedChange={(checked) => {
                            setValue(`interests.${key}`, checked);
                          }}
                        />
                        <Label htmlFor={key}>
                          {INTERESTS_FORM_LABELS[key]}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep("scenarios")}
                    disabled={
                      !Object.values(formValues.interests).some(Boolean)
                    }
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
                    {(
                      Object.keys(formValues.commonScenarios) as Array<
                        keyof typeof formValues.commonScenarios
                      >
                    ).map((key) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          {...register(`commonScenarios.${key}`)}
                        />
                        <Label htmlFor={key}>
                          {SCENARIOS_FORM_LABELS[key]}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleNextStep("count")}
                    disabled={
                      !Object.values(formValues.commonScenarios).some(Boolean)
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
                    <Select {...register("cardsPerCategory")}>
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
                    onClick={() => handleNextStep("generate")}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="generate" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={handleCaptchaChange}
                  />
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!formValues.recaptchaToken}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Generate Flashcards
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>
      </div>
    </form>
  );
}
