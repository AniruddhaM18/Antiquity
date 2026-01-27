"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2, Radio, Clock } from "lucide-react"
import { IoIosRadio } from "react-icons/io";


type WaitingRoomProps = {
  contestId: string
  useDummy?: boolean
}

export default function WaitingRoom({ contestId, useDummy = false }: WaitingRoomProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"waiting" | "starting" | "live">("waiting")
  const [checking, setChecking] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    // DUMMY MODE - Simulate waiting with countdown
    if (useDummy || contestId.includes("dummy")) {
      let timer = 10
      setCountdown(timer)
      
      const dummyInterval = setInterval(() => {
        timer--
        setCountdown(timer)
       
        if (timer <= 3 && timer > 0) {
          setStatus("starting")
        } else if (timer <= 0) {
          clearInterval(dummyInterval)
          setStatus("live")
          // In real app, this would redirect to quiz
          setTimeout(() => {
            // router.push(`/dashboard/quiz/${contestId}`)
          }, 2000)
        }
      }, 1000)

      return () => clearInterval(dummyInterval)
    }

    const checkContestStatus = async () => {
      setChecking(true)
      try {
        const { data } = await api.get(`/contests/get/${contestId}`)
        
        if (data.success && data.contest) {
          if (data.isLive && data.contest.live) {
            setStatus("live")
            // Redirect to live contest when it starts
            router.push(`/dashboard/quiz/${contestId}`)
          } else {
            setStatus("waiting")
          }
        }
      } catch (err) {
        console.error("Failed to check contest status:", err)
      } finally {
        setChecking(false)
      }
    }

    // Check immediately
    checkContestStatus()

    // Poll every 3 seconds
    const interval = setInterval(checkContestStatus, 3000)

    return () => clearInterval(interval)
  }, [contestId, router, useDummy])

  const getStatusMessage = () => {
    switch (status) {
      case "waiting":
        return "Waiting for host to start the contest"
      case "starting":
        return "Contest is starting soon..."
      case "live":
        return "Contest is live!"
      default:
        return "Waiting..."
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "waiting":
        return "text-blue-400"
      case "starting":
        return "text-orange-400"
      case "live":
        return "text-green-400"
      default:
        return "text-neutral-400"
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-neutral-950 rounded-sm  p-8">
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <div className="flex justify-center">
            {status === "waiting" && (
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <IoIosRadio className="size-8 text-blue-400 animate-pulse" />
                </div>
              </div>
            )}
            {status === "starting" && (
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                </div>
              </div>
            )}
            {status === "live" && (
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full animate-ping" />
                </div>
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <h2 className={`text-xl font-semibold ${getStatusColor()}`}>
              {getStatusMessage()}
            </h2>
            <p className="text-sm text-neutral-400">
              {status === "waiting" && "The contest host will start the contest soon. Please wait..."}
              {status === "starting" && "Get ready! The contest is about to begin."}
              {status === "live" && "Redirecting to contest..."}
            </p>
          </div>

          {/* Countdown */}
          {countdown !== null && countdown > 0 && (
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-sm border border-neutral-800">
                <Clock className="size-4 text-orange-400" />
                <span className="text-lg font-semibold text-orange-400">
                  {countdown}s
                </span>
              </div>
            </div>
          )}

          {/* Checking Indicator */}
          {checking && !useDummy && (
            <div className="pt-2">
              <p className="text-xs text-neutral-500">Checking for updates...</p>
            </div>
          )}

          {/* Live Status Badge */}
          {status === "live" && (
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">
                  Contest is live!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}