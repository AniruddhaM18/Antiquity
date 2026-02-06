"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JoinContestButton() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    if (!joinCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      router.push(`/join/${joinCode.toUpperCase().trim()}`);
    } catch (err: any) {
      setError(err.message || "Failed to join contest");
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && joinCode.trim()) {
      handleJoin();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Join code"
        value={joinCode}
        onChange={(e) => {
          setJoinCode(e.target.value.toUpperCase());
          setError("");
        }}
        onKeyDown={handleKeyDown}
        maxLength={10}
        className="
          h-9 w-40
          bg-neutral-950
          border-neutral-800
          text-sm
          shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
          focus-visible:ring-0
        "
      />

      <Button
        onClick={handleJoin}
        disabled={loading || !joinCode.trim()}
        className="
          h-9
          bg-orange-600 text-neutral-100
          shadow-none
          hover:bg-neutral-400
          focus-visible:ring-0
          disabled:opacity-50
        "
      >
        {loading ? "Joining..." : "Join"}
      </Button>

      {error && (
        <span className="ml-2 text-xs text-red-400 whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
}
