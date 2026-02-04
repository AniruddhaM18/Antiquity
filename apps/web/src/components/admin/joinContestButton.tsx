"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function JoinContestButton() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleJoin() {
    if (!joinCode.trim()) return

    setLoading(true)
    setError("")

    try {
      // Navigate to join page with the code
      router.push(`/join/${joinCode.toUpperCase().trim()}`)
    } catch (err: any) {
      setError(err.message || "Failed to join contest")
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && joinCode.trim()) {
      handleJoin()
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-400 mb-2">Enter a code to join a quiz</p>

      <div className="flex gap-2">
        <Input
          placeholder="Enter join code"
          value={joinCode}
          onChange={(e) => {
            setJoinCode(e.target.value.toUpperCase())
            setError("")
          }}
          onKeyDown={handleKeyDown}
          className="
            flex-1
            border-neutral-800
            bg-neutral-950
            shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
            focus-visible:ring-0
          "
          maxLength={10}
        />

        <Button
          onClick={handleJoin}
          disabled={loading || !joinCode.trim()}
          className="
            bg-neutral-300 text-black
            shadow-none
            hover:bg-neutral-400 hover:shadow-none
            focus-visible:ring-0 focus-visible:ring-offset-0
            active:shadow-none
            disabled:opacity-50
          "
        >
          {loading ? "Joining..." : "Join Contest"}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}