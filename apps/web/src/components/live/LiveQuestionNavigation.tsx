"use client"

import { Button } from "@/components/ui/button"
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

export default function LiveQuestionNavigation() {
  const contest = useLiveQuizStore((s) => s.contest)
  const currentIndex = useLiveQuizStore((s) => s.currentIndex)
  const next = useLiveQuizStore((s) => s.next)
  const previous = useLiveQuizStore((s) => s.previous)
  const locked = useLiveQuizStore((s) => s.locked)

  if (!contest) return null

  const total = contest.questions.length

  return (
    <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between bg-neutral-950">
      <Button
        onClick={previous}
        disabled={currentIndex === 0 || locked}
        className="flex items-center gap-2 bg-transparent border border-neutral-800 text-neutral-300 rounded-sm hover:bg-neutral-900 disabled:opacity-50"
      >
        <FaChevronLeft />
        Previous
      </Button>

      <div className="text-sm text-neutral-400">
        Question {currentIndex + 1} of {total}
      </div>

      <Button
        onClick={next}
        disabled={currentIndex === total - 1 || locked}
        className="flex items-center gap-2 bg-transparent border border-neutral-800 text-neutral-300 rounded-sm hover:bg-neutral-900 disabled:opacity-50"
      >
        Next
        <FaChevronRight />
      </Button>
    </div>
  )
}
