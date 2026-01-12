"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconSearch,
  IconSettings,
  IconUsers,
  IconChevronRight,
} from "@tabler/icons-react"

import logo from "../public/anbw.png"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

/* -------------------- TYPES -------------------- */

type Contest = {
  id: string
  title: string
  duration: number
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onCreateContest: () => void
  contests?: Contest[]
  onSelectContest?: (contest: Contest) => void
}

/* -------------------- DATA -------------------- */

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Contests",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
  ],
}

/* -------------------- COMPONENT -------------------- */

export function AppSidebar({
  onCreateContest,
  contests = [],
  onSelectContest,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="offcanvas"
      style={
        {
          /* ===== APP-SPECIFIC SIDEBAR COLORS ===== */
          "--sidebar": "18 18 20",
          "--sidebar-foreground": "228 228 231",

          "--sidebar-accent": "26 26 28",
          "--sidebar-accent-foreground": "244 244 245",

          "--sidebar-border": "255 255 255 / 0.06",
          "--sidebar-ring": "255 255 255 / 0.12",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* ---------- HEADER ---------- */}
      <SidebarHeader className="bg-neutral-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="!p-1.5 h-auto overflow-visible"
            >
              <a href="#">
                <div className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt="Logo"
                    width={36}
                    height={36}
                    className="shrink-0 object-contain"
                    priority
                  />
                  <span className="text-2xl font-mono font-light text-zinc-100">
                    Antiquity
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ---------- CONTENT ---------- */}
      <SidebarContent className="bg-neutral-900">
        <NavMain
          items={data.navMain}
          onCreateContest={onCreateContest}
        />

        {/* ===== USER CONTESTS (LOGIC ONLY) ===== */}
        {contests.length > 0 && (
          <SidebarMenu>
            {contests.map((contest) => (
              <SidebarMenuItem key={contest.id}>
                <SidebarMenuButton
                  onClick={() => onSelectContest?.(contest)}
                >
                  <IconChevronRight className="size-4" />
                  <span>{contest.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}

        <NavDocuments items={data.documents} />

        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>

      {/* ---------- FOOTER ---------- */}
      <SidebarFooter className="bg-neutral-900 border-t border-white/5">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
