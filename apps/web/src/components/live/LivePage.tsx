import Leaderboard from "@/src/components/live/Leaderboard"
import LiveQuestionCard from "@/src/components/live/LiveQuestionCard"
import QuestionsPallate from "./QuestionsPallate"
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import LiveQuestionNavigation from "./LiveQuestionNavigation"

// dummyLiveQuestion
export const dummyLiveQuestion = {
  id: "q1",
  question: "What is the capital of India?",
  options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
}
export default function NewLivePage() {

    const contest = useLiveQuizStore(s => s.contest)
const currentIndex = useLiveQuizStore(s => s.currentIndex)

  return (
    <div className="w-screen h-screen bg-neutral-950">
      <div className="flex w-full h-full">
        
        <div className="w-[20%] h-full">
          <QuestionsPallate />
        </div>

<div className="w-[55%] h-full flex flex-col">
  <div className="flex-1 overflow-y-auto">
    {contest && (
      <LiveQuestionCard
        question={contest.questions[currentIndex]}
        index={currentIndex}
      />
    )}
  </div>

  <LiveQuestionNavigation />
</div>

        <div className="w-[25%] h-full">
          <Leaderboard />
        </div>

      </div>
    </div>
  )
}
