"use client";


import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Home, Trophy, Settings } from "lucide-react";
import LogoIcon from "./ui/logo";

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-neutral-950 text-neutral-300 overflow-hidden"
    >
<SidebarHeader className="h-14 border-b border-neutral-800">
  <div
    className="
      flex h-full items-center px-2
      justify-start
      group-data-[collapsible=icon]:justify-center
    "
  >
    <div className="flex items-center gap-1">
        <div className=" text-purple-300 w-12 h-12 rounded-sm flex items-center justify-center shrink-0">
        <LogoIcon />
        </div>

      <span className="text-xl font-semibold text-slate-300 whitespace-nowrap group-data-[collapsible=icon]:hidden">
        Antiquity
      </span>
    </div>
  </div>
</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            General
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard">
                  <Home className="size-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Dashboard
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/contests">
                  <Trophy className="size-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Contests
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
  <SidebarMenuButton asChild>
    <a href="/dashboard/quizzes">
      <Trophy className="size-4 shrink-0" />
      <span className="group-data-[collapsible=icon]:hidden">
        My Quizzes
      </span>
    </a>
  </SidebarMenuButton>
</SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
