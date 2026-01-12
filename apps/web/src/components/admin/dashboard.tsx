"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ContestCard } from "../ContestCard"
import { QuestionsPanel } from "./questionsPanel"

type Contest = {
  id: string
  title: string
  duration: number
}

export default function DashboardPage() {

   //dummy data 
  const DUMMY_CONTESTS = [
  {
    id: "contest-1",
    title: "JavaScript Basics Quiz",
    duration: 30,
  },
  {
    id: "contest-2",
    title: "React Fundamentals",
    duration: 45,
  },
]
  const [open, setOpen] = useState(false)
  // const [contests, setContests] = useState<Contest[]>([])
  // const [activeContest, setActiveContest] = useState<Contest | null>(null)
  const [contests, setContests] = useState(DUMMY_CONTESTS)
const [activeContest, setActiveContest] = useState(
  DUMMY_CONTESTS[0]
)


 


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
  contests={contests}
  onCreateContest={() => setOpen(true)}
  onSelectContest={(contest) => setActiveContest(contest)}
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
            {/* ===== DASHBOARD CONTENT ===== */}
            {!activeContest ? (
              <div className="flex flex-1 items-center justify-center text-neutral-400">
                Create a contest to start adding questions
              </div>
            ) : (
              <QuestionsPanel contest={activeContest} />
            )}
          </div>

          {/* ===== CREATE CONTEST MODAL ===== */}
          {open && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
              <ContestCard
                onClose={() => setOpen(false)}
                onCreate={({ title, duration }) => {
                  setActiveContest({
                    id: crypto.randomUUID(),
                    title,
                    duration,
                  })
                  setOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
