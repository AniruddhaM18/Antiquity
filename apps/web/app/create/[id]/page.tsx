"use client"
import React, { useState, useEffect } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { nanoid } from "nanoid"
import QuestionsCard from "@/src/components/QuestionsCard"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { QuestionValue } from "@/src/store/useQuestionStore"


export default function CreatePage() {
  const router = useRouter()
  const params = useParams()
  const contestId = params?.id as string

  const [questions, setQuestions] = useState<QuestionValue[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loadingContest, setLoadingContest] = useState(true)
  const [error, setError] = useState("")

  // FETCH CONTEST
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
        const apiUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:3001/api"
        const { data } = await api.get(`/contests/get/${contestId}`);

        if (data.success) {
          setTitle(data.contest.title)
          setDescription(data.contest.description ?? "")

          if (data.contest.questions?.length) {
            const loadedQuestions = data.contest.questions.map((q: any) => ({
              id: q.id ?? nanoid(),
              text: q.question,
              options: q.options,
              correct: q.correct ?? 0,
              points: q.points ?? 10,
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

  // QUESTION OPERATIONS
  function addQuestion() {
    const newQuestion: QuestionValue = {
      id: nanoid(),
      text: "",
      options: ["", "", "", ""],
      correct: 0,
      points: 10,
    }


    setQuestions((prev) => [...prev, newQuestion])
    setCurrentQuestionIndex(questions.length)
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

  // SAVE QUIZ (ADD QUESTIONS)
  // async function saveQuestions() {
  //   const token = localStorage.getItem("token")

  //   if (!token) {
  //     alert("You are not logged in")
  //     return
  //   }

  //   // frontend validation
  //   const invalid = questions.some(
  //     (q) =>
  //       !q.text.trim() ||
  //       q.options.length < 2 ||
  //       q.options.some((opt) => !opt.trim()) ||
  //       q.correct < 0 ||
  //       q.correct >= q.options.length
  //   )

  //   if (invalid) {
  //     alert("Please fill all questions correctly before saving")
  //     return
  //   }

  //   try {
  //     const apiUrl =
  //       process.env.NEXT_PUBLIC_BACKEND_URL ||
  //       "http://localhost:3001/api"

  //     //PURE JSON PAYLOAD
  //     const payload = {
  //       questions: questions.map((q) => ({
  //         text: q.text,
  //         options: q.options,     //ARRAY (JSON)
  //         correct: q.correct,
  //         points: q.points ?? 10,
  //       })),
  //     }

  //     const { data } = await api.post(`/contests/add/${contestId}/questions`, payload);

  //     if (data.success) {
  //       alert("Quiz saved successfully")
  //     }
  //   } catch (err: any) {
  //     console.error("Failed to save quiz:", err)
  //     alert(err.response?.data?.message || "Failed to save quiz")
  //   }
  // }


  // UI
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
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
          >
            Save Quiz
          </button>
        )}

        <div className="pt-2 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 mb-2 px-2">
            Questions ({questions.length})
          </p>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`w-full text-left px-3 py-2 rounded text-sm border transition ${currentQuestionIndex === i
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
        {/* HEADER */}
        <div className="border-b border-neutral-800 px-6 py-4">
          {loadingContest ? (
            <div className="text-neutral-500">Loading contest...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {description && (
                <p className="text-sm text-neutral-400 mt-1">
                  {description}
                </p>
              )}
            </>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex items-center justify-center px-6">
          {questions.length === 0 && !loadingContest ? (
            <div className="text-center text-neutral-500">
              <p className="text-lg mb-2">No questions yet</p>
              <p className="text-sm">
                Click "Add Question" to get started
              </p>
            </div>
          ) : (
            <QuestionsCard
              question={questions[currentQuestionIndex]}
              index={currentQuestionIndex}
            />
          )}
        </div>

        {/* FOOTER */}
        {questions.length > 0 && (
          <div className="border-t border-neutral-800 p-4 flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-800 disabled:opacity-50"
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
              className="flex items-center gap-2 px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-800 disabled:opacity-50"
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
