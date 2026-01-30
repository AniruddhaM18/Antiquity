import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"

export default function HostQuestionControls() {
  const {
    currentIndex,
    contest,
    nextQuestion,
    endContest,
  } = useLiveQuizStore()
const isLastQuestion =
  contest ? currentIndex === contest.questions.length - 1 : false

  return (
    <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between bg-neutral-950">
      <button
        onClick={nextQuestion}
        disabled={isLastQuestion}
        className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 disabled:opacity-50"
      >
        Next Question
      </button>

      <button
        onClick={endContest}
        className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
      >
        End Quiz
      </button>
    </div>
  )
}
