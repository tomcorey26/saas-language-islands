import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="hidden md:block" />
      <main className="min-h-screen bg-background w-full px-4 sm:container sm:p-6 pt-6">
        {children}
      </main>
    </SidebarProvider>
  );
}
