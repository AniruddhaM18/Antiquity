"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

type JoinFormProps = {
  joinCode: string
  onJoinSuccess: (contest: any) => void
  onError: (message: string) => void
}

export default function JoinForm({ joinCode, onJoinSuccess, onError }: JoinFormProps) {
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(joinCode || "")

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      onError("Please enter a join code")
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post("/participants/contest/join", {
        joinCode: code.toUpperCase().trim()
      })

      if (data.success) {
        onJoinSuccess(data.contest)
      } else {
        onError(data.message || "Failed to join contest")
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to join contest"
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-neutral-950 rounded-sm border border-neutral-800 p-6">
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">
          Join Contest
        </h2>
        <p className="text-sm text-neutral-400 mb-6">
          Enter the join code to participate in the contest
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 mb-2 block">
              Join Code
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter join code"
              className="bg-neutral-900 border-neutral-700 text-neutral-200"
              disabled={loading}
              maxLength={10}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-orange-600 hover:bg-orange-600/80 text-white"
          >
            {loading ? "Joining..." : "Join Contest"}
          </Button>
        </form>
      </div>
    </div>
  )
}