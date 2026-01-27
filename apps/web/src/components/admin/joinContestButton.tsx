"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/lib/api"

// DUMMY DATA FOR TESTING
const DUMMY_CONTEST = {
  id: "dummy-contest-123",
  title: "Sample Quiz Contest",
  description: "This is a sample quiz to test the join functionality.",
  joinCode: "TEST123"
}

export function JoinContestButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [useDummy] = useState(true) // Set to true for testing

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const token = localStorage.getItem("token")
    if (!token && !useDummy) {
      setError("You are not logged in")
      setLoading(false)
      return
    }

    // DUMMY MODE - Use dummy data for testing
    if (useDummy || joinCode.toUpperCase() === "TEST123" || joinCode.toUpperCase() === "DUMMY") {
      setTimeout(() => {
        router.push(`/join/${joinCode.toUpperCase()}`)
        setLoading(false)
      }, 1000)
      return
    }

    try {
      const { data } = await api.post("/contest/join", {
        joinCode: joinCode.toUpperCase().trim()
      })

      if (data.success) {
        router.push(`/join/${data.contest.id}`)
      } else {
        setError(data.message || "Failed to join contest")
      }
    } catch (err: any) {
      // Fallback to dummy data if API fails
      if (err.response?.status === 404 || err.response?.status === 500) {
        console.log("API failed, using dummy data for testing")
        setTimeout(() => {
          router.push(`/join/${joinCode.toUpperCase()}`)
          setLoading(false)
        }, 1000)
        return
      }
      const errorMessage = err.response?.data?.message || "Failed to join contest"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Open Form Button */}
      <Button
        className="
          bg-neutral-300 text-black
          shadow-none
          hover:bg-neutral-300 hover:shadow-none
          focus-visible:ring-0 focus-visible:ring-offset-0
          active:shadow-none
        "
        onClick={() => setOpen(true)}
      >
        Join Contest
      </Button>

      {/* Form */}
      {open && (
        <Card className="bg-neutral-900 border border-neutral-800 shadow-none rounded-md">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">
                Join Contest
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Dummy data indicator */}
              {useDummy && (
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
                  <p className="text-yellow-300/70">🧪 Testing Mode: Try codes TEST123 or DUMMY</p>
                </div>
              )}

              {/* Join Code */}
              <Input
                placeholder="Enter join code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="
                  border-neutral-800
                  shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  focus-visible:ring-0
                "
                required
                maxLength={10}
              />

              {/* Error Message */}
              {error && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                  {error}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2 pt-2">
              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !joinCode.trim()}
                className="
                  bg-orange-500 text-white
                  shadow-none
                  hover:bg-orange-300 hover:shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  active:shadow-none
                "
              >
                {loading ? "Joining..." : "Join"}
              </Button>

              {/* Cancel */}
              <Button
                type="button"
                variant="outline"
                className="
                  border-neutral-800 text-neutral-300
                  shadow-none
                  hover:bg-transparent hover:shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  active:shadow-none
                "
                onClick={() => {
                  setOpen(false)
                  setError("")
                  setJoinCode("")
                }}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}