import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="hidden md:block" />
      {/* Mobile hamburger menu - top right corner */}
      <div className="md:hidden fixed top-1 right-4 z-50">
        <SidebarTrigger className="h-10 w-10 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm" />
      </div>
      <main className="min-h-screen bg-background w-full px-4 sm:container sm:p-6 pt-12 md:pt-6">
        {children}
      </main>
    </SidebarProvider>
  );
}
