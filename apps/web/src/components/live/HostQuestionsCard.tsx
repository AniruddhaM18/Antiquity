"use client"
import { FaCheck } from "react-icons/fa"

type Props = {
    question: {
        id: string
        question: string
        options: string[]
        correct?: number
    }
    index: number
}

/**
 * Read-only question card for hosts.
 * Shows the correct answer highlighted in green.
 * No interaction allowed.
 */
export default function HostQuestionCard({ question, index }: Props) {
    const correctIndex = question.correct ?? 0

    return (
        <div className="w-full bg-neutral-950 text-neutral-200">
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
                        const isCorrect = i === correctIndex

                        return (
                            <div
                                key={i}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded border text-left transition
                  ${isCorrect
                                        ? "border-green-500 bg-green-500/15"
                                        : "border-neutral-700 bg-neutral-900/50"
                                    }`}
                            >
                                <div className={`w-7 h-7 rounded-sm border flex items-center justify-center
                    ${isCorrect
                                        ? "bg-green-500 border-green-500"
                                        : "border-neutral-500"
                                    }`}
                                >
                                    {isCorrect && (
                                        <FaCheck size={12} className="text-white" strokeWidth={3} />
                                    )}
                                </div>

                                <span className="text-sm">{opt}</span>
                                {isCorrect && (
                                    <span className="ml-auto text-xs text-green-400 font-medium">
                                        Correct Answer
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
