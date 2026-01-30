"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLeaderboard } from "@/lib/contestApi";
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore";
import lion from "../../../public/lion.png";
import lion2 from "../../../public/Lion2.png";
import happy from "../../../public/happy.png";

type Player = {
  id: string;
  name: string;
  score: number;
};

export default function Leaderboard() {
  const contestId = useLiveQuizStore((s) => s.contestId);
  const leaderboardVersion = useLiveQuizStore((s) => s.leaderboardVersion);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!contestId) return;
    // Skip leaderboard for dummy/test contest (no such contest in DB)
    if (contestId === "dummy-contest-123") return;

    function load() {
      fetchLeaderboard(contestId!)
        .then((data) => {
          const list = (data.leaderboard || []).map((entry: any) => ({
            id: entry.user?.id ?? entry.userId ?? "",
            name: entry.user?.name ?? "Anonymous",
            score: entry.score ?? 0,
          }));
          setPlayers(list);
        })
        .catch(() => { });
    }

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [contestId, leaderboardVersion]); // Added leaderboardVersion - triggers refresh on answer submit

  const rankStyles = (index: number) => {
    if (index === 0) return "border-orange-400 bg-orange-400/10 text-orange-400";
    if (index === 1) return "border-orange-500 bg-orange-500/10 text-orange-500";
    if (index === 2) return "border-orange-600 bg-orange-600/10 text-orange-600";
    return "border-neutral-800 bg-neutral-900 text-white";
  };

  return (
    <div className="w-full h-full bg-neutral-950 border border-neutral-800 text-white p-4 flex flex-col">
      <h2 className="text-lg font-medium mb-3 text-center">Live Leaderboard</h2>
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
              <div className="flex items-center gap-3">
                <span className="font-bold w-6 text-center">{index + 1}</span>
                <span>{player.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono">{player.score}</span>
                {index === 0 && <Image src={lion} alt="1st" width={28} height={28} />}
                {index === 1 && <Image src={lion2} alt="2nd" width={28} height={28} />}
                {index === 2 && <Image src={happy} alt="3rd" width={28} height={28} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}