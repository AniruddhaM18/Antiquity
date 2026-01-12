"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ContestCard } from "../ContestCard"

export default function DashboardPage() {
  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        onCreateContest={() => setOpen(true)}
      />

      <SidebarInset className="bg-neutral-950 overflow-hidden">
        <SiteHeader />

        <div className="flex flex-1 p-4 relative">
          <div
            className="
              flex flex-1 flex-col
              rounded-2xl
              bg-neutral-900
              border border-white/5
              shadow-[6px_6px_14px_rgba(0,0,0,0.75),-6px_-6px_14px_rgba(255,255,255,0.03)]
            "
          >
            {/* normal dashboard content */}
          </div>

          {open && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
              <ContestCard onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
