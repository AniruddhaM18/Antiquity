import Leaderboard from "@/src/components/live/Leaderboard"
import LiveQuestionCard from "@/src/components/live/LiveQuestionCard"
import QuestionsPallate from "./QuestionsPallate"
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import LiveQuestionNavigation from "./LiveQuestionNavigation"

type Props = {
  /** Called when user moves to next question (submits current answer). */
  onSubmitAnswer?: (questionId: string, optionIndex: number) => void
  /** Called when user finishes the quiz (clicks Submit Quiz on last question). */
  onFinishQuiz?: () => void
}

export const dummyLiveQuestion = {
  id: "q1",
  question: "What is the capital of India?",
  options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
}

export default function NewLivePage({ onSubmitAnswer, onFinishQuiz }: Props) {
  const contest = useLiveQuizStore((s) => s.contest)
  const currentIndex = useLiveQuizStore((s) => s.currentIndex)

  return (
    <div className="w-screen h-full bg-neutral-950 flex">
      {/* Left: Questions Palette */}
      <div className="w-[20%] h-full border-r border-neutral-800">
        <QuestionsPallate />
      </div>

      {/* Center: Question Card + Navigation */}
      <div className="w-[55%] h-full flex flex-col">
        {/* Question area - takes remaining space */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {contest && contest.questions[currentIndex] ? (
            <LiveQuestionCard
              question={contest.questions[currentIndex]}
              index={currentIndex}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              Loading question...
            </div>
          )}
        </div>

        {/* Navigation - fixed at bottom */}
        <div className="flex-shrink-0">
          <LiveQuestionNavigation
            onSubmitAnswer={onSubmitAnswer}
            onFinishQuiz={onFinishQuiz}
          />
        </div>
      </div>

      {/* Right: Leaderboard */}
      <div className="w-[25%] h-full border-l border-neutral-800">
        <Leaderboard />
      </div>
    </div>
  )
}