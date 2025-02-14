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
  CreateWorldRequestSchema,
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
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatedPalmTree } from "@/components/AnimatedPalmTree";

type Inputs = CreateWorldRequest;

type FormStep =
  | "language"
  | "personal"
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
  {
    id: "dating",
    label: "Dating",
  },
] as const;

const languageColors = {
  spanish: {
    primary: "bg-[#F1BF00] hover:bg-[#DFB200] text-black",
    secondary: "bg-[#C60B1E] hover:bg-[#B00A1B] text-white",
  },
  french: {
    primary: "bg-[#002395] hover:bg-[#001B70] text-white",
    secondary: "bg-[#ED2939] hover:bg-[#D62533] text-white",
  },
  german: {
    primary: "bg-[#000000] hover:bg-[#1A1A1A] text-white",
    secondary: "bg-[#DD0000] hover:bg-[#C70000] text-white",
  },
  italian: {
    primary: "bg-[#009246] hover:bg-[#007A3B] text-white",
    secondary: "bg-[#CE2B37] hover:bg-[#B82631] text-white",
  },
  portuguese: {
    primary: "bg-[#006600] hover:bg-[#005500] text-white",
    secondary: "bg-[#FF0000] hover:bg-[#E60000] text-white",
  },
} as const;

const languageFlags = {
  spanish: "🇪🇸",
  french: "🇫🇷",
  german: "🇩🇪",
  italian: "🇮🇹",
  portuguese: "🇵🇹",
} as const;

// TODO: Use the Shadcn form component to make the form
// TODO: Fix broken AI generation
// TODO: Add validation to form
// TODO: Add a loading state

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<FormStep>("language");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([
    "language",
  ]);

  const form = useForm<Inputs>({
    defaultValues: {
      language: "spanish",
      name: "",
      occupation: "",
      location: "",
      cardsPerCategory: 5,
      interests: [],
      commonScenarios: [],
      recaptchaToken: "",
    },
    resolver: zodResolver(CreateWorldRequestSchema),
    mode: "onTouched",
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

  const isStepCompleted = (step: FormStep) => completedSteps.includes(step);

  const handleNextStep = (step: FormStep) => {
    setCurrentStep(step);
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const isStepAccessible = (step: FormStep): boolean => {
    const stepOrder: FormStep[] = [
      "language",
      "personal",
      "interests",
      "scenarios",
      "count",
      "generate",
    ];
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const targetStepIndex = stepOrder.indexOf(step);
    return targetStepIndex <= currentStepIndex || isStepCompleted(step);
  };

  const formValues = form.watch();

  const handleCaptchaChange = (token: string | null) => {
    form.setValue("recaptchaToken", token || "");
  };

  function returnToForm() {
    setFlashcards(null);
    handleCaptchaChange(null);
  }

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-center items-center min-h-[50vh]"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center flex flex-col items-center"
          >
            <AnimatedPalmTree />
            <h2 className="text-2xl font-bold">
              Generating your flashcards...
            </h2>
            <p className="text-sm text-gray-500 mt-2">This may take a bit</p>
          </motion.div>
          <LoadingSpinner />
        </motion.div>
      </motion.div>
    );
  }

  if (flashcards) {
    return (
      <PreviewFlashcards
        flashcards={flashcards}
        formData={formValues}
        onBack={returnToForm}
      />
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle
                className={`text-2xl font-bold text-center ${
                  formValues.language === "spanish"
                    ? "text-[#F1BF00]"
                    : formValues.language === "french"
                    ? "text-[#002395]"
                    : formValues.language === "german"
                    ? "text-[#000000]"
                    : formValues.language === "italian"
                    ? "text-[#009246]"
                    : formValues.language === "portuguese"
                    ? "text-[#006600]"
                    : "text-blue-800"
                }`}
              >
                Personalized Language Flashcards{" "}
                {
                  languageFlags[
                    formValues.language as keyof typeof languageFlags
                  ]
                }
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
                onValueChange={(value) => {
                  const step = value as FormStep;
                  if (isStepAccessible(step)) {
                    setCurrentStep(step);
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-6 h-min">
                  {[
                    { value: "language", icon: Languages, label: "Language" },
                    { value: "personal", icon: BookOpen, label: "Personal" },
                    { value: "interests", icon: Heart, label: "Interests" },
                    { value: "scenarios", icon: Globe, label: "Scenarios" },
                    { value: "count", icon: Hash, label: "Count" },
                    { value: "generate", icon: Sparkles, label: "Generate" },
                  ].map(({ value, icon: Icon, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className={`flex flex-col items-center gap-2 ${
                        !isStepAccessible(value as FormStep)
                          ? "opacity-50 cursor-not-allowed"
                          : "data-[state=active]:bg-blue-100"
                      }`}
                      disabled={!isStepAccessible(value as FormStep)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline">{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="language" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Select Language
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
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
                              Select the language you want to generate
                              flashcards for
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleNextStep("personal")}
                        disabled={!formValues.language}
                        className={
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.primary
                        }
                      >
                        Next Step
                      </Button>
                    </div>
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
                            <FormLabel>
                              Your Name
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Your Occupation
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your occupation"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Your Location
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your city/country"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("language")}
                        className={
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.secondary
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => handleNextStep("interests")}
                        disabled={
                          !formValues.name ||
                          !formValues.occupation ||
                          !formValues.location
                        }
                        className={
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.primary
                        }
                      >
                        Next Step
                      </Button>
                    </div>
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
                            <FormLabel className="text-base">
                              Interests
                            </FormLabel>
                            <FormDescription>
                              Choose your interests (Pick at least 1)
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
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("personal")}
                      className={
                        languageColors[
                          formValues.language as keyof typeof languageColors
                        ]?.secondary
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handleNextStep("scenarios")}
                      disabled={
                        !Object.values(formValues.interests).some(Boolean)
                      }
                      className={
                        languageColors[
                          formValues.language as keyof typeof languageColors
                        ]?.primary
                      }
                    >
                      Next Step
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="scenarios" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="commonScenarios"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              Scenarios
                            </FormLabel>
                            <FormDescription>
                              Choose the scenarios you want to generate
                              flashcards for (Pick at least 1)
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
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("interests")}
                      className={
                        languageColors[
                          formValues.language as keyof typeof languageColors
                        ]?.secondary
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handleNextStep("count")}
                      disabled={
                        !Object.values(formValues.commonScenarios).some(Boolean)
                      }
                      className={
                        languageColors[
                          formValues.language as keyof typeof languageColors
                        ]?.primary
                      }
                    >
                      Next Step
                    </Button>
                  </div>
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
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("scenarios")}
                        className={
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.secondary
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => handleNextStep("generate")}
                        className={
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.primary
                        }
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="generate" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      onChange={handleCaptchaChange}
                    />
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("count")}
                        className={
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.secondary
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        className={`${
                          languageColors[
                            formValues.language as keyof typeof languageColors
                          ]?.primary
                        } flex items-center gap-2`}
                        disabled={!formValues.recaptchaToken}
                        type="submit"
                      >
                        <Send className="w-4 h-4" />
                        Generate Flashcards
                      </Button>
                    </div>
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
