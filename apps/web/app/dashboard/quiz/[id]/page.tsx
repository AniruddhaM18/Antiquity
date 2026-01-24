"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { api } from "@/lib/api"

export default function QuizDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [contest, setContest] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

      const { data } = await api.get(`/contests/get/${id}`);
      setContest(data.contest)
    }

    fetch()
  }, [id])

  if (!contest) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{contest.title}</h1>

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/create/${contest.id}`)}
          className="px-4 py-2 rounded bg-neutral-800"
        >
          Edit Quiz
        </button>

        <button
          onClick={() => router.push(`/contest/${id}/launch`)}
          className="px-4 py-2 rounded bg-blue-600"
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
