"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Contest, QuestionInput } from "../types"
import { AddQuestionCard } from "../QuestionCard"


const emptyQuestion = (): QuestionInput => ({
  text: "",
  options: ["", ""],
  correct: 0,
  points: 10,
})

export function QuestionsPanel({ contest }: { contest: Contest }) {
    //dummy
  const DUMMY_QUESTIONS = [
  {
    text: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Undefined"],
    correct: 2,
    points: 10,
  },
  {
    text: "What does `useState` return?",
    options: [
      "A state value",
      "A setter function",
      "An array with state & setter",
      "An object",
    ],
    correct: 2,
    points: 10,
  },
]
  // const [questions, setQuestions] = useState<QuestionInput[]>([
  //   emptyQuestion(),
  // ])
  const [questions, setQuestions] = useState<QuestionInput[]>(
  DUMMY_QUESTIONS
)


  const updateQuestion = (i: number, q: QuestionInput) => {
    const copy = [...questions]
    copy[i] = q
    setQuestions(copy)
  }

  const addQuestion = () => {
    setQuestions((q) => [...q, emptyQuestion()])
  }

  const submitQuestions = async () => {
    await fetch(`/api/contest/${contest.id}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions }),
    })
  }




  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">
          {contest.title}
        </h2>
        <p className="text-sm text-zinc-400">
          Duration: {contest.duration} minutes
        </p>
      </div>

      <div className="space-y-6 px-8">
      {questions.map((q, i) => (
        <AddQuestionCard
          key={i}
          index={i}
          question={q}
          onChange={(updated) => updateQuestion(i, updated)}
          onRemove={() =>
            setQuestions((prev) =>
              prev.filter((_, idx) => idx !== i)
            )
          }
        />
      ))}
      

      <div className="flex gap-3">
        <Button className="zinc-btn" variant="secondary" onClick={addQuestion}>
          Add Question
        </Button>
        <Button className="zinc-sub" onClick={submitQuestions}>
          Submit Questions
        </Button>
      </div>
    </div>
    </div>
  )
}
