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
import {
  CreateWorldRequest,
  CreateWorldResponse,
} from "@/zod/contracts/world.schema";
import { useForm, SubmitHandler } from "react-hook-form";
import { PreviewFlashcards } from "@/app/create/_components/FlashCardsPreview";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type Inputs = CreateWorldRequest;

type FormStep =
  | "language"
  | "personal"
  | "work"
  | "interests"
  | "scenarios"
  | "count"
  | "generate";

const interest_items = [
  {
    id: "reading",
    label: "Reading",
  },
  {
    id: "gaming",
    label: "Gaming",
  },
  {
    id: "cooking",
    label: "Cooking",
  },
  {
    id: "music",
    label: "Music",
  },
  {
    id: "sports",
    label: "Sports",
  },
  {
    id: "art",
    label: "Art",
  },
  {
    id: "technology",
    label: "Technology",
  },
  {
    id: "photography",
    label: "Photography",
  },
  {
    id: "travel",
    label: "Travel",
  },
  {
    id: "writing",
    label: "Writing",
  },
  {
    id: "dancing",
    label: "Dancing",
  },
  {
    id: "gardening",
    label: "Gardening",
  },
] as const;

const scenario_items = [
  {
    id: "travel",
    label: "Travel",
  },
  {
    id: "dining",
    label: "Dining",
  },
  {
    id: "shopping",
    label: "Shopping",
  },
  {
    id: "healthcare",
    label: "Healthcare",
  },
  {
    id: "smallTalk",
    label: "Small Talk",
  },
  {
    id: "emergencies",
    label: "Emergencies",
  },
  {
    id: "directions",
    label: "Directions",
  },
  {
    id: "culture",
    label: "Culture",
  },
] as const;

// TODO: Use the Shadcn form component to make the form
// TODO: Fix broken AI generation
// TODO: Add validation to form
// TODO: Add a loading state

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<FormStep>("language");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<Inputs>({
    defaultValues: {
      language: "spanish",
      name: "",
      occupation: "",
      cardsPerCategory: 5,
      interests: [],
      commonScenarios: [],
      recaptchaToken: "",
    },
  });

  const [flashcards, setFlashcards] = useState<
    CreateWorldResponse["flashcards"] | null
  >(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsGenerating(true);
    try {
      const responseData = await generateIslands(data);
      setFlashcards(responseData.flashcards);
    } catch {
      toast({
        title: "Error",
        description:
          "An error occurred while generating flashcards. We are recieving a lot of requests, please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = (step: FormStep) => {
    setCurrentStep(step);
  };

  const formValues = form.watch();

  const handleCaptchaChange = (token: string | null) => {
    form.setValue("recaptchaToken", token || "");
  };

  if (isGenerating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner className="animate-spin" />
      </div>
    );
  }

  if (flashcards) {
    return (
      <PreviewFlashcards
        flashcards={flashcards}
        formData={formValues}
        onBack={() => setFlashcards(null)}
      />
    );
  }
  return (
    <Form {...form}>
      <form
        className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-800">
                Personalized Language Flashcards
              </CardTitle>
              <CardDescription className="text-center">
                Let&apos;s create flashcards tailored to your interests and
                needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={currentStep}
                className="w-full"
                onValueChange={(value) => setCurrentStep(value as FormStep)}
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
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Language</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="spanish">
                                  Spanish 🇪🇸
                                </SelectItem>
                                <SelectItem value="french">
                                  French 🇫🇷
                                </SelectItem>
                                <SelectItem value="german">
                                  German 🇩🇪
                                </SelectItem>
                                <SelectItem value="italian">
                                  Italian 🇮🇹
                                </SelectItem>
                                <SelectItem value="portuguese">
                                  Portuguese 🇵🇹
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the language you want to learn.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your name will be used to personalize the
                              flashcards.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
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
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Occupation</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your occupation"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your occupation will be used to personalize the
                              flashcards.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
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
                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Sidebar</FormLabel>
                            <FormDescription>
                              Select the items you want to display in the
                              sidebar.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {interest_items.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            item.id
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  item.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                </TabsContent>

                <TabsContent value="scenarios" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="commonScenarios"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Sidebar</FormLabel>
                            <FormDescription>
                              Select the items you want to display in the
                              sidebar.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {scenario_items.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="commonScenarios"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            item.id
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  item.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                </TabsContent>

                <TabsContent value="count" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="cardsPerCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              How many flashcards per category?
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      disabled={!formValues.recaptchaToken}
                      type="submit"
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
    </Form>
  );
}
