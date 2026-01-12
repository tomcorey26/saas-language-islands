import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { auth } from "@clerk/nextjs/server";
import { getUser, createUser } from "@/server/db/users";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user data server-side
  let dbUser = await getUser(userId);

  // If user doesn't exist in database, create them
  if (!dbUser) {
    try {
      await createUser({
        clerkUserId: userId,
      });

      // Fetch the newly created user
      dbUser = await getUser(userId);

      // If still no user, something is seriously wrong
      if (!dbUser) {
        console.error("Failed to create user in database for userId:", userId);
        redirect("/sign-in");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      // For now, redirect to sign-in, but you might want to show an error page instead
      redirect("/sign-in");
    }
  }

  // If user hasn't completed onboarding (no base language set), redirect
  if (!dbUser.baseLanguage) {
    redirect("/onboarding");
  }

  const userTokens = dbUser.tokensBalance;

  return (
    <SidebarProvider>
      <AppSidebar userTokens={userTokens} />
      <SidebarTrigger className="hidden md:block" />
      <main className="min-h-screen bg-background w-full px-4 sm:container sm:p-6 pt-6">
        {children}
      </main>
    </SidebarProvider>
  );
}
