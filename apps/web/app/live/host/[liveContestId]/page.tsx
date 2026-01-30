"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchContest } from "@/lib/contestApi"
import { moveToNextQuestion, endLiveContest } from "@/lib/contestApi"
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore"
import NewLivePage from "@/src/components/live/LivePage"
import Leaderboard from "@/src/components/live/Leaderboard"
import QuestionsPallate from "@/src/components/live/QuestionsPallate"
import type { Contest } from "@/src/components/types"

export default function HostLivePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const liveContestId = params?.liveContestId as string
  const contestId = searchParams.get("contestId")

  const [contest, setContest] = useState<Contest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const setContestStore = useLiveQuizStore((s) => s.setContest)
  const setLiveIds = useLiveQuizStore((s) => s.setLiveIds)
  const currentIndex = useLiveQuizStore((s) => s.currentIndex)
  const contestFromStore = useLiveQuizStore((s) => s.contest)

  useEffect(() => {
    if (!contestId || !liveContestId) {
      setError("Missing contest or live session")
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const res = await fetchContest(contestId!)
        if (cancelled) return
        if (!res.success || !res.contest) {
          setError("Contest not found")
          setLoading(false)
          return
        }
        const c = res.contest
        if (!c.live?.id || c.live.id !== liveContestId) {
          setError("Contest not live or session mismatch")
          setLoading(false)
          return
        }
        setContest(c)
        const questions = (c.questions || []).map((q: any) => ({
          id: q.id,
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
        }))
        setContestStore({ id: c.id, title: c.title, questions })
        setLiveIds(liveContestId, c.id)
      } catch (e) {
        if (!cancelled) setError("Failed to load contest")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [contestId, liveContestId, setContestStore, setLiveIds])

  const handleNext = async () => {
    if (!liveContestId) return
    try {
      await moveToNextQuestion(liveContestId)
    } catch (e) {
      console.error(e)
    }
  }

  const handleEnd = async () => {
    if (!liveContestId) return
    try {
      await endLiveContest(liveContestId)
      router.push("/dashboard/created")
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        Loading…
      </div>
    )
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error || "Contest not found"}</p>
        <button
          onClick={() => router.push("/dashboard/created")}
          className="px-4 py-2 rounded bg-neutral-700"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const total = contestFromStore?.questions?.length ?? 0
  const isLastQuestion = total > 0 && currentIndex >= total - 1

  return (
    <div className="w-screen h-screen bg-neutral-950">
      <div className="flex w-full h-full">
        {/* <div className="w-[20%] h-full">
          <QuestionsPallate />
        </div> */}
        <div className=" h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {contestFromStore && <NewLivePage />}
          </div>
          <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between gap-4 bg-neutral-950">
            <button
              onClick={handleNext}
              disabled={isLastQuestion}
              className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 disabled:opacity-50"
            >
              Next Question
            </button>
            <button
              onClick={handleEnd}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
            >
              End Quiz
            </button>
          </div>
        </div>
        {/* <div className="w-[25%] h-full">
          <Leaderboard />
        </div> */}
      </div>
    </div>
  )
}