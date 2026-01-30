import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import HostQuestionControls from "./HostQuestionControl"
import Leaderboard from "./Leaderboard"
import LiveQuestionCard from "./LiveQuestionCard"
import QuestionsPallate from "./QuestionsPallate"

export function HostLivePage() {
  const contest = useLiveQuizStore((s) => s.contest)
  const currentIndex = useLiveQuizStore((s) => s.currentIndex)

  return (
    <div className="w-screen h-screen bg-neutral-950 flex flex-col">
      <div className="flex flex-1">
        {/* Left */}
        <div className="w-[20%] border-r border-neutral-800">
          <QuestionsPallate />
        </div>

        {/* Center */}
        <div className="w-[55%] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {contest?.questions[currentIndex] ? (
              <LiveQuestionCard
                question={contest.questions[currentIndex]}
                index={currentIndex}
                readonly  // important
              />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-400">
                Loading question...
              </div>
            )}
          </div>

          <HostQuestionControls />
        </div>

        {/* Right */}
        <div className="w-[25%] border-l border-neutral-800">
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}
