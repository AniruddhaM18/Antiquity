"use client"
import NewNavbar from "@/src/components/new/navbar"
import QuestionNavigation from "@/src/components/new/questionNavigation"
import NewSidebar from "@/src/components/new/sidebar"
import QuestionsCard from "@/src/components/QuestionsCard"
import { useQuestionStore } from "@/src/store/useQuestionStore"
import { useParams } from "next/navigation"
import { useEffect } from "react";

export default function NewPage() {

  const { id } = useParams()
  const loadContest = useQuestionStore((s) => s.loadContest)

  useEffect(() => {
    if (id) loadContest(id as string)
  }, [id])
  const contest = useQuestionStore((s) => s.contest)
  const currentViewingIndex = useQuestionStore((s) => s.currentViewingIndex)

  const questions = contest.questions
  const currentQuestion = questions[currentViewingIndex]

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
