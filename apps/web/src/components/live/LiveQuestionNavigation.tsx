"use client"

import { Button } from "@/components/ui/button"
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

type Props = {
  onSubmitAnswer?: (questionId: string, optionIndex: number) => void
  onFinishQuiz?: () => void
}

export default function LiveQuestionNavigation({ onSubmitAnswer, onFinishQuiz }: Props) {
  const contest = useLiveQuizStore((s) => s.contest)
  const currentIndex = useLiveQuizStore((s) => s.currentIndex)
  const answers = useLiveQuizStore((s) => s.answers)
  const next = useLiveQuizStore((s) => s.next)
  const previous = useLiveQuizStore((s) => s.previous)

  if (!contest) return null

  const total = contest.questions.length
  const currentQuestion = contest.questions[currentIndex]
  const hasSelection = currentQuestion && answers[currentQuestion.id] !== undefined
  const isLastQuestion = currentIndex === total - 1

  // Submit current answer and move to next question
  const handleNext = () => {
    if (currentQuestion && hasSelection) {
      onSubmitAnswer?.(currentQuestion.id, answers[currentQuestion.id])
    }
    next()
  }

  // Submit final answer and finish quiz
  const handleFinish = () => {
    if (currentQuestion && hasSelection) {
      onSubmitAnswer?.(currentQuestion.id, answers[currentQuestion.id])
    }
    onFinishQuiz?.()
  }

  return (
    <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between gap-4 bg-neutral-950">
      <Button
        onClick={previous}
        disabled={currentIndex === 0}
        className="flex items-center gap-2 bg-transparent border border-neutral-800 text-neutral-300 rounded-sm hover:bg-neutral-900 disabled:opacity-50"
      >
        <FaChevronLeft />
        Previous
      </Button>

      <div className="text-sm text-neutral-400 shrink-0">
        Question {currentIndex + 1} of {total}
      </div>

      {isLastQuestion ? (
        <Button
          onClick={handleFinish}
          disabled={!hasSelection}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white rounded-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          Submit Quiz
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white rounded-sm"
        >
          Next
          <FaChevronRight />
        </Button>
      )}
    </div>
  )
}