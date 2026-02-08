"use client"

import LogoIcon from "@/components/ui/logo"
import Link from "next/link"
import { FiPlay, FiPlus } from "react-icons/fi"
import { BsSave } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { useQuestionStore } from "@/src/store/useQuestionStore"
import { useState } from "react"
import { startLiveContest, fetchContest } from "@/lib/contestApi"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CiSaveDown2 } from "react-icons/ci";
import { CiPlay1 } from "react-icons/ci";



export default function NewNavbar() {
  const router = useRouter()
  const title = useQuestionStore((s) => s.contest.title)
  const description = useQuestionStore((s) => s.contest.description)
  const setTitle = useQuestionStore((s) => s.setContestTitle)
  const setDescription = useQuestionStore((s) => s.setContestDescription)
  const saveQuestions = useQuestionStore((s) => s.saveQuestions)
  const joinCode = useQuestionStore((s) => s.contest.joinCode ?? null)

  const [loading, setLoading] = useState(false)
  const [goingLive, setGoingLive] = useState(false)

  // Already live popup state
  const [showAlreadyLive, setShowAlreadyLive] = useState(false)
  const [liveContestUrl, setLiveContestUrl] = useState("")

  async function handleSave() {
    try {
      setLoading(true)
      await saveQuestions()
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    if (!joinCode) return
    navigator.clipboard.writeText(joinCode)
  }

  async function handleGoLive() {
    try {
      setGoingLive(true)
      // Save first if needed
      await saveQuestions()
      // Get the latest contest state (may have been updated by saveQuestions)
      const latestContest = useQuestionStore.getState().contest
      if (!latestContest.id) {
        console.error("No contest ID found")
        return
      }
      // Start the live contest
      const result = await startLiveContest(latestContest.id)
      // Navigate to host page
      router.push(`/live/host/${result.liveContest.id}?contestId=${latestContest.id}`)
    } catch (err: any) {
      // Check if contest is already live
      if (err?.message?.toLowerCase().includes("already live")) {
        // Fetch the contest to get the live session URL
        try {
          const latestContest = useQuestionStore.getState().contest
          const res = await fetchContest(latestContest.id!)
          if (res.contest?.live?.id) {
            setLiveContestUrl(`/live/host/${res.contest.live.id}?contestId=${latestContest.id}`)
            setShowAlreadyLive(true)
          }
        } catch {
          console.error("Failed to fetch live contest info")
        }
      } else {
        console.error("Failed to go live:", err)
      }
    } finally {
      setGoingLive(false)
    }
  }

  function goToLiveContest() {
    if (liveContestUrl) {
      router.push(liveContestUrl)
    }
  }

  return (
    <>
      <nav className="relative min-h-18 w-screen bg-neutral-950 flex items-center font-inter border-b border-neutral-800 px-6">
        {/* Left */}
        <Link href="/" className="flex items-center">
          <LogoIcon />
          <span className="text-inter text-neutral-300 ml-4">Antiquity</span>
        </Link>

        {/* Center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Quiz"
            className="bg-transparent text-neutral-200 text-sm font-medium text-center outline-none placeholder:text-neutral-500 focus:text-white"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="mt-0.5 bg-transparent text-neutral-400 text-xs text-center outline-none placeholder:text-neutral-600 focus:text-neutral-300"
          />
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center">
          {joinCode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={copyCode}
                    className="mr-2 px-4 py-1.5 text-sm cursor-pointer rounded border border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                  >
                    Join Code: <span className="font-semibold">{joinCode}</span>
                  </div>
                </TooltipTrigger>

                <TooltipContent side="top" align="center">
                  <p className="text-xs">Click to copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}


          <div className="h-8.5 w-8.5 flex items-center justify-center rounded-sm bg-neutral-800 border border-neutral-800 text-neutral-400 text-lg mr-2">
            <FiPlus />
          </div>

          <div className="h-8.5 w-8.5 flex items-center justify-center rounded-sm text-lg bg-neutral-800 border border-neutral-800 text-neutral-400/95 ">
            <IoSettingsOutline />
          </div>

          <Button
            onClick={handleSave}
            className="text-sm flex items-center gap-1 justify-center text-neutral-200 bg-neutral-900 border border-neutral-800 px-4 m-2 hover:bg-neutral-800/50"
          >
            <CiSaveDown2 />
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={handleGoLive}
            disabled={goingLive}
            className="bg-orange-600 text-neutral-100 text-sm px-3 py-1 hover:bg-orange-600/85 disabled:opacity-50"
          >
            <FiPlay />
            {goingLive ? "Starting..." : "Go Live"}
          </Button>
        </div>
      </nav>

      {/* Already Live Popup */}
      {showAlreadyLive && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-3">Contest Already Live</h2>
            <p className="text-neutral-400 mb-6">
              This quiz is already running a live session. Would you like to go to the live host page?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAlreadyLive(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={goToLiveContest}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white"
              >
                Go to Live Quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

