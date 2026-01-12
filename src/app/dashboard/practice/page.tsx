import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser } from "@/server/db/users";
import { PracticePageWrapper } from "./_components/PracticePageWrapper";

export default async function PracticePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await getUser(userId);

  if (!dbUser) {
    redirect("/sign-in");
  }

  return <PracticePageWrapper userTokens={dbUser.tokensBalance} />;
}
