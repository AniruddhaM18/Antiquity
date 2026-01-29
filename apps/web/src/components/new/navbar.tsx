"use client"

import LogoIcon from "@/components/ui/logo"
import { FiPlus } from "react-icons/fi"
import { CiPlay1 } from "react-icons/ci"
import { IoSettingsOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { useQuestionStore } from "@/src/store/useQuestionStore"
import { useState } from "react"

export default function NewNavbar() {
  const title = useQuestionStore((s) => s.contest.title)
  const description = useQuestionStore((s) => s.contest.description)
  const setTitle = useQuestionStore((s) => s.setContestTitle)
  const setDescription = useQuestionStore((s) => s.setContestDescription)
  const saveQuestions = useQuestionStore((s) => s.saveQuestions)
  const joinCode = useQuestionStore((s) => s.contest.joinCode ?? null)

  const [loading, setLoading] = useState(false)

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

  return (
    <nav className="relative min-h-18 w-screen bg-neutral-950 flex items-center font-inter border-b border-neutral-800 px-6">
      {/* Left */}
      <div>
        <LogoIcon />
      </div>

      <div className="text-inter text-neutral-300 ml-4">
        Antiquity
      </div>

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
          <div
            onClick={copyCode}
            title="Click to copy"
            className="mr-2 px-3 py-1.5 text-xs cursor-pointer rounded border border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
          >
            Join Code: <span className="font-semibold">{joinCode}</span>
          </div>
        )}

        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-800 text-neutral-400 mr-2">
          <FiPlus />
        </div>

        <div className="h-9 w-9 flex items-center justify-center rounded-sm bg-neutral-800 border border-neutral-800 text-neutral-400/95 mr-2">
          <IoSettingsOutline />
        </div>

        <Button
          onClick={handleSave}
          className="text-sm flex items-center gap-1 justify-center text-neutral-200 bg-neutral-900 border border-neutral-800 px-4 m-2 hover:bg-neutral-800/50"
        >
          <CiPlay1 />
          {loading ? "Saving..." : "Save"}
        </Button>

        <Button className="bg-orange-600 text-neutral-100 text-sm px-4 py-1 hover:bg-orange-600/85">
          Publish
        </Button>
      </div>
    </nav>
  )
}
