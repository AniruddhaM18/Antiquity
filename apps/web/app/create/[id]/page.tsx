"use client"

import React, { useState, useEffect } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { QuestionsCard } from "@/src/components/QuestionsCard"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"

type Question = {
  text: string
  options: string[]
  correct: number
  points: number
}

export default function CreatePage() {
  const router = useRouter()
  const { id: contestId } = useParams<{ id: string }>()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loadingContest, setLoadingContest] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!contestId) return

    const fetchContest = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("You are not logged in")
        setLoadingContest(false)
        router.push("/home")
        return
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api"
        
        const { data } = await axios.get(
          `${apiUrl}/contests/get/${contestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (data.success) {
          setTitle(data.contest.title)
          setDescription(data.contest.description)
          
          // If questions already exist, load them
          if (data.contest.questions && data.contest.questions.length > 0) {
            const loadedQuestions = data.contest.questions.map((q: any) => ({
              text: q.question,
              options: q.options,
              correct: q.correct || 0,
              points: q.points || 10,
            }))
            setQuestions(loadedQuestions)
          }
        }
      } catch (err: any) {
        console.error("Failed to load contest:", err)
        
        if (err.response?.status === 404) {
          setError("Contest not found")
        } else if (err.response?.status === 403) {
          setError("You don't have permission to access this contest")
        } else {
          setError("Failed to load contest")
        }
        
        setTimeout(() => {
          router.push("/home")
        }, 2000)
      } finally {
        setLoadingContest(false)
      }
    }

    fetchContest()
  }, [contestId, router])

  function addQuestion() {
    const newQuestion: Question = {
      text: "",
      options: ["", "", "", ""],
      correct: 0,
      points: 10,
    }

    setQuestions((prev) => [...prev, newQuestion])
    setCurrentQuestionIndex(questions.length) // Navigate to the new question
  }

  function updateQuestion(index: number, data: Question) {
    setQuestions((prev) => {
      const next = [...prev]
      next[index] = data
      return next
    })
  }

  function deleteQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))

    // Adjust current index after deletion
    if (currentQuestionIndex >= questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, questions.length - 2))
    }
  }

  function goToQuestion(index: number) {
    setCurrentQuestionIndex(index)
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  async function saveQuestions() {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("You are not logged in")
      return
    }

    // Validate questions
    const invalidQuestions = questions.filter(
      (q) => !q.text || q.options.some((opt) => !opt)
    )

    if (invalidQuestions.length > 0) {
      alert("Please fill in all question fields before saving")
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api"
      
      const { data } = await axios.post(
        `${apiUrl}/contests/add/${contestId}/questions`,
        { questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (data.success) {
        alert("Questions saved successfully!")
      }
    } catch (err: any) {
      console.error("Failed to save questions:", err)
      alert(err.response?.data?.message || "Failed to save questions")
    }
  }

  return (
    <div className="flex h-full bg-neutral-950 text-neutral-200">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-neutral-800 p-4 space-y-3">
        <button
          onClick={() => router.push("/home")}
          className="w-full text-left px-3 py-2 text-sm rounded border border-neutral-700 hover:bg-neutral-800 transition"
        >
          ← Home
        </button>

        <button
          onClick={addQuestion}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-neutral-700 rounded text-sm hover:bg-neutral-800 transition"
        >
          <Plus size={14} />
          Add Question
        </button>

        {questions.length > 0 && (
          <button
            onClick={saveQuestions}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
          >
            Save Questions
          </button>
        )}

        <div className="pt-2 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 mb-2 px-2">Questions ({questions.length})</p>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`w-full text-left px-3 py-2 rounded text-sm border transition ${
                  currentQuestionIndex === i
                    ? "bg-neutral-800 border-neutral-600"
                    : "border-transparent hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Question {i + 1}</span>
                  {q.text && (
                    <span className="text-xs text-green-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col bg-neutral-900/80 overflow-hidden">
        {/* CONTEST HEADER */}
        <div className="border-b border-neutral-800 px-6 py-4 flex-shrink-0">
          {loadingContest ? (
            <div className="text-neutral-500">Loading contest...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-neutral-100">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-neutral-400 mt-1">
                  {description}
                </p>
              )}
            </>
          )}
        </div>

        {/* QUESTION DISPLAY AREA */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
          {questions.length === 0 && !loadingContest ? (
            <div className="text-center text-neutral-500">
              <p className="text-lg mb-2">No questions yet</p>
              <p className="text-sm">Click "Add Question" to get started</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="w-full max-w-4xl h-full flex items-center py-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="w-full"
                  style={{ display: currentQuestionIndex === index ? 'block' : 'none' }}
                >
                  <QuestionsCard
                    questionNo={index + 1}
                    value={question}
                    onChange={(data) => updateQuestion(index, data)}
                    onDelete={() => deleteQuestion(index)}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* NAVIGATION FOOTER */}
        {questions.length > 0 && (
          <div className="border-t border-neutral-800 p-4 flex items-center justify-between flex-shrink-0">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="text-sm text-neutral-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}