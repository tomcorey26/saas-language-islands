import { auth } from "@clerk/nextjs/server";
import { getUser, createUser } from "@/server/db/users";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./_components/OnboardingForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe } from "lucide-react";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let dbUser = await getUser(userId);

  // If user doesn't exist in database, create them
  if (!dbUser) {
    try {
      await createUser({
        clerkUserId: userId,
      });
      dbUser = await getUser(userId);
    } catch (error) {
      console.error("Error creating user:", error);
      redirect("/sign-in");
    }
  }

  if (!dbUser) {
    redirect("/sign-in");
  }

  // If user already has a base language set, redirect to dashboard
  if (dbUser.baseLanguage) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              Welcome to Speech Islands!
            </CardTitle>
            <CardDescription className="text-base">
              Let&apos;s set up your language preference to get started.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm">What is your base language?</h3>
            <p className="text-sm text-muted-foreground">
              Your base language is the language you already know. When you
              create flashcards, the phrase will be shown in your base language,
              and the translation will be in the language you&apos;re learning.
            </p>
          </div>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
