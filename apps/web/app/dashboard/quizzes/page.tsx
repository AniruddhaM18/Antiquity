"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreVertical } from "lucide-react"

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
      const { data } = await api.get(`/contests/getAll?my=true`)
      setContests(data.contests)
    }

    fetch()
  }, [])

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contests.map((c) => (
          <div
            key={c.id}
            className="group relative p-4 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition cursor-pointer"
            onClick={() => router.push(`/dashboard/quiz/${c.id}`)}
          >
            {/* 3 DOT MENU */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-neutral-700"
                  >
                    <MoreVertical size={18} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/new/${c.id}`)
                    }}
                  >
                    Edit Quiz
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/contest/${c.id}/launch`)
                    }}
                  >
                    Launch Quiz
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* CARD CONTENT */}
            <h2 className="font-medium">{c.title}</h2>

            <p className="text-sm text-neutral-400 mt-2">
              {c._count.questions} Questions
            </p>

            <p className="text-xs text-neutral-500 mt-1">
              Created {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
