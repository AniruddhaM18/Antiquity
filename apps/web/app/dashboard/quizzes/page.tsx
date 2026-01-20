"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

type Contest = {
  id: string
  title: string
  createdAt: string
  _count: {
    questions: number
  }
}

export default function MyQuizzesPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

      const { data } = await axios.get(
        `${apiUrl}/contests/getAll?my=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setContests(data.contests)
    }

    fetch()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">My Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contests.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/dashboard/quiz/${c.id}`)}
            className="p-4 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-left"
          >
            <h2 className="font-medium">{c.title}</h2>
            <p className="text-sm text-neutral-400">
              {c._count.questions} questions
            </p>
            <p className="text-xs text-neutral-500">
              Created {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
