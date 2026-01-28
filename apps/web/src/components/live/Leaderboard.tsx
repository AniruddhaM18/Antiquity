"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import lion from "../../../public/lion.png"
import lion2 from "../../../public/Lion2.png"
import happy from "../../../public/happy.png"

type Player = {
  id: string
  name: string
  score: number
}

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "Alice", score: 120 },
  { id: "2", name: "Bob", score: 95 },
  { id: "3", name: "Charlie", score: 80 },
  { id: "4", name: "David", score: 60 },
  { id: "5", name: "Eva", score: 40 },
  { id: "6", name: "Frank", score: 35 },
  { id: "7", name: "Grace", score: 30 },
  { id: "8", name: "Hannah", score: 25 },
  { id: "9", name: "Ivan", score: 20 },
  { id: "10", name: "Julia", score: 15 },
]

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev =>
        [...prev]
          .map(p => ({
            ...p,
            score: p.score + Math.floor(Math.random() * 20),
          }))
          .sort((a, b) => b.score - a.score)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const rankStyles = (index: number) => {
    if (index === 0)
      return "border-orange-400 bg-orange-400/10 text-orange-400"
    if (index === 1)
      return "border-orange-500 bg-orange-500/10 text-orange-500"
    if (index === 2)
      return "border-orange-600 bg-orange-600/10 text-orange-600"
    return "border-neutral-800 bg-neutral-900 text-white"
  }

  return (
<div className="w-full h-full bg-neutral-950 border border-neutral-800 text-white p-4 flex flex-col">
      <h2 className="text-lg font-medium mb-3 text-center">
        Live Leaderboard
      </h2>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`flex items-center justify-between py-2 px-3 mb-2 border rounded-sm transition-colors ${rankStyles(index)}`}
            >
              {/* LEFT: Rank + Name */}
              <div className="flex items-center gap-3">
                <span className="font-bold w-6 text-center">
                  {index + 1}
                </span>
                <span>{player.name}</span>
              </div>

              {/* RIGHT: Score + Badge */}
              <div className="flex items-center gap-2">
                <span className="font-mono">{player.score}</span>

                {index === 0 && (
                  <Image src={lion} alt="1st" width={28} height={28} />
                )}
                {index === 1 && (
                  <Image src={lion2} alt="2nd" width={28} height={28} />
                )}
                {index === 2 && (
                  <Image src={happy} alt="3rd" width={28} height={28} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
