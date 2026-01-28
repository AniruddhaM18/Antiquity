"use client"
import { LiveQuestion, useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import { FaCheck } from "react-icons/fa";

type Props = {
  question: LiveQuestion
  index: number
}

export default function LiveQuestionCard({ question, index }: Props) {
  const { answers, selectAnswer, locked } = useLiveQuizStore()

  const selected = answers[question.id] ?? null

  return (
    <div className="w-full bg-neutral-950  text-neutral-200">
      <div className="px-4 py-4 border-b border-neutral-800 bg-neutral-900">
        <span className="text-lg font-semibold">
          Question {index + 1}
        </span>
      </div>
      <div className="p-4">
        <p className="mb-5 py-2 text-lg font-medium leading-relaxed">
          {question.question}
        </p>

        <div className="space-y-6">
          {question.options.map((opt, i) => {
            const isSelected = selected === i

            return (
              <button
                key={i}
                disabled={locked}
                onClick={() => selectAnswer(question.id, i)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded border text-left transition
                  ${
                    isSelected
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-neutral-700 bg-neutral-900/50 hover:border-neutral-500"
                  }
                  ${locked ? "opacity-70 cursor-not-allowed" : ""}`}>
                <div className={`w-7 h-7 rounded-sm border flex items-center justify-center
                    ${
                      isSelected
                        ? "bg-orange-500 border-orange-500"
                        : "border-neutral-500"}`}>
                  {isSelected && (
                    <FaCheck size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>

                <span className="text-sm">{opt}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  
  )
}
