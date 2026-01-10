import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PracticePageWrapper } from "./_components/PracticePageWrapper";

export default async function PracticePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <PracticePageWrapper />;
}
