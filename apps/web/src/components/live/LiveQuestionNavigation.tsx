"use client"

import { Button } from "@/components/ui/button"
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

type Props = {
  onSubmitAnswer?: () => void
}

export default function LiveQuestionNavigation({ onSubmitAnswer }: Props) {
  const contest = useLiveQuizStore((s) => s.contest)
  const currentIndex = useLiveQuizStore((s) => s.currentIndex)
  const answers = useLiveQuizStore((s) => s.answers)
  const next = useLiveQuizStore((s) => s.next)
  const previous = useLiveQuizStore((s) => s.previous)
  const lock = useLiveQuizStore((s) => s.lock)
  const locked = useLiveQuizStore((s) => s.locked)

  if (!contest) return null

  const total = contest.questions.length
  const currentQuestion = contest.questions[currentIndex]
  const hasSelection = currentQuestion && answers[currentQuestion.id] !== undefined

  const handleSubmitAnswer = () => {
    if (locked || !hasSelection) return
    onSubmitAnswer?.()
    lock()
  }

  return (
    <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between gap-4 bg-neutral-950">
      <Button
        onClick={previous}
        disabled={currentIndex === 0 || locked}
        className="flex items-center gap-2 bg-transparent border border-neutral-800 text-neutral-300 rounded-sm hover:bg-neutral-900 disabled:opacity-50"
      >
        <FaChevronLeft />
        Previous
      </Button>

      <div className="text-sm text-neutral-400 shrink-0">
        Question {currentIndex + 1} of {total}
      </div>

      <Button
        onClick={handleSubmitAnswer}
        disabled={!hasSelection || locked}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white rounded-sm disabled:opacity-50 disabled:pointer-events-none"
      >
        Submit Answer
      </Button>

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