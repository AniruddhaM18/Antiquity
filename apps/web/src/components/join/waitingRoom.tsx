"use client";

import { useEffect, useState } from "react";
import { fetchContest } from "@/lib/contestApi";
import { Loader2, Clock } from "lucide-react";
import { IoIosRadio } from "react-icons/io";

type WaitingRoomProps = {
  contestId: string;
  joinCode: string;
  onGoLive: (liveContestId: string) => void;
};

export default function WaitingRoom({ contestId, joinCode, onGoLive }: WaitingRoomProps) {
  const [status, setStatus] = useState<"waiting" | "starting" | "live">("waiting");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!joinCode) return;

    async function check() {
      setChecking(true);
      try {
        const data = await fetchContest(joinCode);
        const c = data.contest;
        const live = c?.live;
        if (live?.id && !live?.endedAt) {
          setStatus("live");
          onGoLive(live.id);
          return;
        }
        setStatus("waiting");
      } catch {
        setStatus("waiting");
      } finally {
        setChecking(false);
      }
    }

    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [joinCode, onGoLive]);

  const copy = {
    waiting: { msg: "Waiting for host to start the contest", sub: "The contest host will start the contest soon. Please wait..." },
    starting: { msg: "Contest is starting soon...", sub: "Get ready! The contest is about to begin." },
    live: { msg: "Contest is live!", sub: "Redirecting to contest..." },
  };
  const { msg, sub } = copy[status];
  const color = status === "waiting" ? "text-blue-400" : status === "starting" ? "text-orange-400" : "text-green-400";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-neutral-950 rounded-sm p-8">
        <div className="text-center space-y-6">
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
          <div className="space-y-2">
            <h2 className={`text-xl font-semibold ${color}`}>{msg}</h2>
            <p className="text-sm text-neutral-400">{sub}</p>
          </div>
          {checking && (
            <div className="pt-2">
              <p className="text-xs text-neutral-500">Checking for updates...</p>
            </div>
          )}
          {status === "live" && (
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Contest is live!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}