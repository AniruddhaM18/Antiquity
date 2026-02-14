"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import NewNavbar from "@/src/components/new/navbar"
import QuestionNavigation from "@/src/components/new/questionNavigation"
import NewSidebar from "@/src/components/new/sidebar"
import QuestionsCard from "@/src/components/QuestionsCard"
import { useQuestionStore } from "@/src/store/useQuestionStore"
import { fetchContest } from "@/lib/contestApi"

export default function NewPage() {
  const { id } = useParams()
  const router = useRouter()
  const loadContest = useQuestionStore((s) => s.loadContest)

  const [isHost, setIsHost] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Check host role before loading contest (only for existing contests)
  useEffect(() => {
    if (!id) return

    async function checkAccess() {
      try {
        const data = await fetchContest(id as string)
        // Contest exists - check if user is host
        if (!data.isHost) {
          setError("Access denied: Only the contest host can edit this quiz")
          setTimeout(() => router.push("/dashboard"), 2000)
          return
        }
        setIsHost(true)
        await loadContest(id as string)
      } catch (err: any) {
        // If 404, this is a new contest being created - allow access
        if (err.response?.status === 404 || err.message?.includes("not found")) {
          setIsHost(true)
          // Don't try to load - it's a new contest
        } else {
          setError(err.message || "Failed to load contest")
          setTimeout(() => router.push("/dashboard"), 2000)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [id, loadContest, router])

  const contest = useQuestionStore((s) => s.contest)
  const currentViewingIndex = useQuestionStore((s) => s.currentViewingIndex)

  const questions = contest.questions
  const currentQuestion = questions[currentViewingIndex]

  // Loading state
  if (loading) {
    return (
      <main className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </main>
    )
  }

  // Error/Access denied state
  if (error || !isHost) {
    return (
      <main className="h-screen w-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-red-400 text-lg font-medium mb-2">
            {error || "Access Denied"}
          </div>
          <p className="text-neutral-500 text-sm">Redirecting to dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen w-screen bg-neutral-950 flex flex-col overflow-hidden">
      <NewNavbar />

      <section className="flex flex-1 overflow-hidden">
        <NewSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {currentQuestion && (
                <QuestionsCard
                  key={currentQuestion.id}
                  question={{
                    id: currentQuestion.id,
                    question: currentQuestion.question,
                    options: Object.values(currentQuestion.options ?? {}),
                    correct: currentQuestion.correct,
                    points: currentQuestion.points,
                  }}
                  index={currentViewingIndex}
                />
              )}
            </div>

          </div>

          <QuestionNavigation />
        </div>
      </section>
    </main>
  )
}
