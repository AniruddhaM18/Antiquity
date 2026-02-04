"use client";

import { useRouter } from "next/navigation";
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

import LogoIcon from "./ui/logo";
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { PiTrophyBold } from "react-icons/pi";

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

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
                  <FiHome className="size-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Dashboard
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/contests">
                  <PiTrophyBold className="size-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Contests
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/created">
                  <IoFileTrayStackedOutline className="size-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Created
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/quizzes">
                  <HiOutlineRectangleStack className="size-4 shrink-0" />
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
            <SidebarMenuButton onClick={handleLogout} className="cursor-pointer">
              <MdLogout className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

