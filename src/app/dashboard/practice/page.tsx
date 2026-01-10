import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageLayout } from "../_components/DashboardPageLayout";
import { ConversationPracticeMode } from "./_components/ConversationPracticeMode";

export default async function PracticePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardPageLayout
      pageTitle="Conversation Practice"
      backButtonHref="/dashboard"
    >
      <ConversationPracticeMode />
    </DashboardPageLayout>
  );
}
