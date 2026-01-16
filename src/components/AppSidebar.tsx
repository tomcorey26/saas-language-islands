import { BarChart, BookOpen, Home, Settings, User } from "lucide-react";

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
    title: "Account",
    url: "/dashboard/account",
    icon: User,
    disabled: false,
  },
  // {
  //   title: "Stats",
  //   url: "#",
  //   icon: BarChart,
  //   disabled: true,
  //   comingSoon: true,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    disabled: false,
  },
];

interface AppSidebarProps {
  userTokens: number;
}

export function AppSidebar({ userTokens }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Speech Islands</SidebarGroupLabel>
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
                <TokenUsage availableTokens={userTokens} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
