import { BarChart, BookOpen, Home, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { TokenUsage } from "@/components/TokenUsage";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    disabled: false,
  },
  {
    title: "Decks",
    url: "/dashboard/decks",
    icon: BookOpen,
    disabled: false,
  },
  {
    title: "Stats",
    url: "#",
    icon: BarChart,
    disabled: true,
    comingSoon: true,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    disabled: true,
    comingSoon: true,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Islands of Language</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* User profile section with separator and better styling */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={item.disabled}>
                    <a
                      href={item.url}
                      className={
                        item.disabled
                          ? "opacity-50 cursor-not-allowed flex items-center"
                          : "flex items-center"
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {item.comingSoon && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md">
                          Coming Soon
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Separator className="my-2" />
              <SidebarMenuItem>
                <UserButton showName />
              </SidebarMenuItem>
              <Separator className="my-2" />
              <SidebarMenuItem>
                {/* Token usage visualization */}
                <div className="flex justify-center py-2">
                  <TokenUsage tokensUsed={100} totalTokens={1000} />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
