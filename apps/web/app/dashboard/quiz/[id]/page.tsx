"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { api } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function QuizDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [contest, setContest] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    const fetch = async () => {
      const { data } = await api.get(`/contests/get/${id}`);
      setContest(data.contest)
    }

    fetch()
  }, [id, isAuthenticated, router])

  if (!contest) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-4">

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/new/${contest.id}`)}
          className="px-4 py-2 rounded bg-neutral-800"
        >
          Edit Quiz
        </button>

        <button
          onClick={() => router.push(`/contest/${id}/launch`)}
          className="px-4 py-2 rounded bg-orange-600"
        >
          Launch Quiz
        </button>
      </div>

      <div className="text-sm text-neutral-400">
        {contest.questions.length} questions
      </div>
    </div>
  )
}
