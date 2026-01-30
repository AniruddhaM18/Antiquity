"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { startLiveContest } from "@/lib/contestApi"
import { fetchContest } from "@/lib/contestApi"

export default function LaunchQuizPage() {
  const { id } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [contest, setContest] = useState<{ joinCode?: string } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id || typeof id !== "string") return

    const start = async () => {
      try {
        const data = await startLiveContest(id)
        if (data.success && data.liveContest?.id) {
          const res = await fetchContest(id)
          setContest(res.contest ?? {})
          setStatus("success")
          router.replace(`/live/host/${data.liveContest.id}?contestId=${id}`)
          return
        }
        setError(data.message || "Failed to start")
        setStatus("error")
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to launch")
        setStatus("error")
      }
    }

    start()
  }, [id, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        Launching quiz…
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.push(`/dashboard/quiz/${id}`)}
          className="px-4 py-2 rounded bg-neutral-700"
        >
          Back to Quiz
        </button>
      </div>
    )
  }

  const joinCode = contest?.joinCode ?? ""

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
      <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-green-400">Contest is live!</h1>
        <p className="text-neutral-300">
          Share this code with participants: <strong>{joinCode || "—"}</strong>
        </p>
        <p className="text-xs text-neutral-400">
          Participants go to: /join/{joinCode}
        </p>
        <button
          onClick={() => router.push(`/dashboard/quiz/${id}`)}
          className="w-full mt-2 px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600"
        >
          Back to Quiz
        </button>
      </div>
    </div>
  )
}