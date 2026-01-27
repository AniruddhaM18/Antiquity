"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import JoinNavbar from "@/src/components/join/navbar"
import JoinLoader from "@/src/components/join/loader"
import ContestInfo from "@/src/components/join/contestInfo"
import WaitingRoom from "@/src/components/join/waitingRoom"
import { api } from "@/lib/api"
import { Contest } from "@/src/components/types"

type JoinState = "loading" | "form" | "joined" | "waiting" | "error"

// DUMMY DATA FOR TESTING
const DUMMY_CONTEST: Contest = {
  id: "dummy-contest-123",
  title: "Dududu Quiz Contest",
  description: "This is a sample quiz to test the join functionality. Answer all questions correctly to win!",
  createdBy: "dummy-user",
  joinCode: "TEST123",
  createdAt: new Date(),
  questions: [
    {
      id: "q1",
      contestId: "dummy-contest-123",
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
      points: 10
    },
    {
      id: "q2",
      contestId: "dummy-contest-123",
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      points: 10
    },
    {
      id: "q3",
      contestId: "dummy-contest-123",
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      correct: 2,
      points: 10
    }
  ]
}

export default function JoinPage() {
  const params = useParams()
  const router = useRouter()
  const joinCode = params?.id as string
  const [useDummy] = useState(true) // Set to true for testing

  const [state, setState] = useState<JoinState>("loading")
  const [contest, setContest] = useState<Contest | null>(null)
  const [error, setError] = useState("")
  const [isMember, setIsMember] = useState(false)

  // Check membership and load contest
  useEffect(() => {
    const initialize = async () => {
      if (!joinCode) {
        setState("error")
        setError("No join code provided")
        return
      }

      const token = localStorage.getItem("token")
      if (!token && !useDummy) {
        router.push("/auth/signin")
        return
      }

      // DUMMY MODE - Auto-join with dummy data
      if (useDummy || joinCode.toUpperCase() === "TEST123" || joinCode.toUpperCase() === "DUMMY") {
        setTimeout(() => {
          setContest({
            ...DUMMY_CONTEST,
            joinCode: joinCode.toUpperCase()
          })
          setIsMember(true)
          setState("waiting")
        }, 1500) // Simulate loading
        return
      }

      try {
        // Try to get contest info
        const { data } = await api.get(`/contests/get/${joinCode}`)
        
        if (data.success) {
          setContest(data.contest)
          
          // Check if user is a member
          const memberCheck = data.contest.members?.some(
            (m: any) => m.userId === data.userId
          )
          
          if (memberCheck) {
            setIsMember(true)
            setState("waiting")
          } else {
            // Not a member, try to join
            await handleJoin()
          }
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Contest not found")
        } else if (err.response?.status === 403) {
          setError("You don't have permission to access this contest")
        } else {
          setError("Failed to load contest")
        }
        setState("error")
      }
    }

    initialize()
  }, [joinCode, router, useDummy])

  const handleJoin = async () => {
    try {
      const { data } = await api.post("/contest/join", {
        joinCode: joinCode.toUpperCase().trim()
      })

      if (data.success) {
        setContest(data.contest)
        setIsMember(true)
        setState("waiting")
        setError("")
      } else {
        setError(data.message || "Failed to join contest")
        setState("error")
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to join contest"
      setError(errorMessage)
      setState("error")
    }
  }

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
      <JoinNavbar />

      <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-6">
          {/* Dummy mode indicator
          {useDummy && (
            <div className="w-full p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-400 text-center">
               Testing Mode: Using dummy data. Try join codes: TEST123 or DUMMY
            </div>
          )} */}

          {/* Error State */}
          {state === "error" && (
            <div className="w-full max-w-2xl mx-auto p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                Error
              </h2>
              <p className="text-sm text-red-300">{error}</p>
              <button
                onClick={() => router.push("/home")}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-sm text-red-400 transition"
              >
                Go Back Home
              </button>
            </div>
          )}

          {/* Loading State */}
          {state === "loading" && <JoinLoader />}

          {/* Waiting State - Show Contest Info + Waiting Room */}
          {state === "waiting" && contest && (
            <>
              <ContestInfo contest={contest} isMember={isMember} />
              <WaitingRoom 
                contestId={contest.id} 
                useDummy={useDummy || contest.id.includes("dummy")} 
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}