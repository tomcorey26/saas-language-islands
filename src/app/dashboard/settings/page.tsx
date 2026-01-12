import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/server/db/users";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { redirect } from "next/navigation";
import { BaseLanguageForm } from "./_components/BaseLanguageForm";
import { SupportedLanguageCode } from "@/data/supportedLanguages";
import { DEFAULT_BASE_LANGUAGE } from "@/data/prompts";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await getUser(userId);

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <DashboardPageLayout pageTitle="Settings" backButtonHref="/dashboard">
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <BaseLanguageForm
          currentBaseLanguage={
            (dbUser.baseLanguage as SupportedLanguageCode) ??
            DEFAULT_BASE_LANGUAGE
          }
        />
      </div>
    </DashboardPageLayout>
  );
}
