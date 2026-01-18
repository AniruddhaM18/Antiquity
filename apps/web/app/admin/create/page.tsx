"use client"

import React, { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { QuestionsCard } from "@/src/components/QuestionsCard"
import { useRouter } from "next/navigation"

type Question = {
  text: string
  options: string[]
  correct: number
  points: number
}

export default function CreatePage() {
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const refs = useRef<(HTMLDivElement | null)[]>([])

  function addQuestion() {
    const index = questions.length

    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        options: ["", ""],
        correct: 0,
        points: 10,
      },
    ])

    setActiveIndex(index)

    // scroll after render
    setTimeout(() => {
      refs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 0)
  }

  function updateQuestion(index: number, data: Question) {
    setQuestions((prev) => {
      const next = [...prev]
      next[index] = data
      return next
    })
  }

  function focusQuestion(index: number) {
    setActiveIndex(index)
    refs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  function deleteQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))

    // fix active index
    setActiveIndex((prev) => {
      if (prev === null) return null
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })

    // clean refs so indexes don’t drift
    refs.current.splice(index, 1)
  }


  return (
    <div className="flex h-full bg-neutral-950 text-neutral-200">
      <aside className="w-64 border-r border-neutral-800 p-4 space-y-3">
  {/* HOME BUTTON */}
  <button
    onClick={() => router.push("/admin/home")}
    className="w-full text-left px-3 py-2 text-sm rounded border border-neutral-700 hover:bg-neutral-800"
  >
    ← Home
  </button>

  {/* ADD QUESTION */}
  <button
    onClick={addQuestion}
    className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-neutral-700 rounded text-sm hover:bg-neutral-800"
  >
    <Plus size={14} />
    Add Question
  </button>

  {/* QUESTION LIST */}
  <div className="space-y-1">
    {questions.map((_, i) => (
      <button
        key={i}
        onClick={() => focusQuestion(i)}
        className={`w-full text-left px-3 py-2 rounded text-sm border ${
          activeIndex === i
            ? "bg-neutral-800 border-neutral-600"
            : "border-transparent hover:bg-neutral-900"
        }`}
      >
        Question {i + 1}
      </button>
    ))}
  </div>
</aside>


      <main className=" bg-neutral-900/80 flex-1 overflow-y-auto p-6 pt-4 space-y-8">
        {questions.map((q, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            // className={`transition ${activeIndex === i ? "ring-1 ring-neutal-500/50" : ""
            //   }`}
          >
            <QuestionsCard
              questionNo={i + 1}
              value={q}
              onChange={(data) => updateQuestion(i, data)}
              onDelete={() => deleteQuestion(i)}
            />
          </div>
        ))}


      </main>
    </div>
  )
}
