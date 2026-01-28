"use client"

import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import { useEffect } from "react"

const mockContest = {
  id: "contest-1",
  title: "Demo Quiz",
  questions: [
    {
      id: "q1",
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    },
    {
      id: "q2",
      question: "2 + 2 equals?",
      options: ["3", "4", "5", "6"],
    },
    {
      id: "q3",
      question: "Which planet is known as Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
    },
  ],
}

export default function QuestionsPalette() {
  const {
    contest,
    currentIndex,
    answers,
    setContest,
  } = useLiveQuizStore()

  useEffect(() => {
    if (!contest) {
      setContest(mockContest)
    }
  }, [contest, setContest])

  if (!contest) return null

  return (
<aside className="w-full h-full bg-neutral-950 p-3 flex flex-col border-r border-neutral-800">
      <div className="px-2 py-2">
        <p className="text-md font-medium text-neutral-200">
          Questions
        </p>
        <p className="text-sm mt-2 mb-2 text-neutral-500">
          No. of Questions {contest.questions.length}
        </p>
      </div>

   <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {contest.questions.map((q, i) => {
          const isActive = currentIndex === i
          const isAnswered = answers[q.id] !== undefined

          let cardClasses =
            "h-22 rounded px-4 py-4 border text-sm transition " +
            "border-neutral-800 bg-neutral-900/40"

          if (isActive) {
            cardClasses +=
              " border-orange-600/80 bg-orange-500/10"
          } else if (isAnswered) {
            cardClasses += " border-green-600/60"
          }

          return (
            <div
              key={q.id}
              className={cardClasses}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  Question.{i + 1}
                </span>

                {isAnswered && (
                  <span className="text-xs text-green-500">✓</span>
                )}
              </div>

              <p className="text-xs text-neutral-400 mt-1 truncate">
                {q.question}
              </p>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
