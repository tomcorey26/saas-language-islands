import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/server/db/users";
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
  const dbUser = await getUser(userId);

  if (!dbUser) {
    redirect("/sign-in");
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
