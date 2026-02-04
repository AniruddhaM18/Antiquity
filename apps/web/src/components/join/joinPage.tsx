"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import JoinNavbar from "@/src/components/join/navbar";
import JoinLoader from "@/src/components/join/loader";
import ContestInfo from "@/src/components/join/contestInfo";
import WaitingRoom from "@/src/components/join/waitingRoom";
import LiveContestView from "@/src/components/join/LiveContestView";
import Leaderboard from "@/src/components/live/Leaderboard";
import { fetchContest, joinContestByCode } from "@/lib/contestApi";
import { Contest } from "@/src/components/types";
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore";

type JoinState = "loading" | "form" | "joined" | "waiting" | "live" | "ended" | "error";

const DUMMY_CONTEST: Contest = {
  id: "dummy-contest-123",
  title: "Dududu Quiz Contest",
  description: "Sample quiz.",
  createdBy: "dummy-user",
  joinCode: "TEST123",
  createdAt: new Date(),
  questions: [
    { id: "q1", contestId: "dummy-contest-123", question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1, points: 10 },
    { id: "q2", contestId: "dummy-contest-123", question: "Capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2, points: 10 },
    { id: "q3", contestId: "dummy-contest-123", question: "Closest planet to Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: 2, points: 10 },
  ],
};

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const joinCode = (params?.id as string)?.toUpperCase?.()?.trim();
  const [useDummy] = useState(false);

  const [state, setState] = useState<JoinState>("loading");
  const [contest, setContest] = useState<Contest | null>(null);
  const [error, setError] = useState("");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!joinCode) {
      setState("error");
      setError("No join code provided");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !useDummy) {
      router.push("/auth/signin");
      return;
    }

    if (useDummy || joinCode === "TEST123" || joinCode === "DUMMY") {
      setTimeout(() => {
        setContest({ ...DUMMY_CONTEST, joinCode });
        setIsMember(true);
        setState("waiting");
      }, 1500);
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        const data = await fetchContest(joinCode);
        if (cancelled) return;
        if (!data.success) {
          setError(data.message || "Contest not found");
          setState("error");
          return;
        }

        const c = data.contest;
        const hasLive = !!c?.live?.id;
        const isEnded = hasLive && !!c?.live?.endedAt;
        const isLive = hasLive && !isEnded;
        const memberCheck = c?.members?.some((m: any) => m.userId === data.userId);

        if (memberCheck) {
          setContest(c);
          setIsMember(true);
          // Set liveIds for leaderboard  
          if (c?.live?.id) {
            useLiveQuizStore.getState().setLiveIds(c.live.id, c.id);
          }
          setState(isEnded ? "ended" : isLive ? "live" : "waiting");
          return;
        }

        try {
          const joinData = await joinContestByCode(joinCode);
          if (cancelled) return;
          if (joinData.success) {
            setContest((prev) => (prev ? { ...prev, ...joinData.contest } : { ...c, ...joinData.contest }));
            setIsMember(true);
            // Set liveIds for leaderboard
            if (c?.live?.id) {
              useLiveQuizStore.getState().setLiveIds(c.live.id, c.id);
            }
            const hasLiveSession = !!c?.live?.id;
            const isContestEnded = hasLiveSession && !!c?.live?.endedAt;
            const nextLive = hasLiveSession && !isContestEnded;
            setState(isContestEnded ? "ended" : nextLive ? "live" : "waiting");
          } else {
            setError(joinData.message || "Failed to join");
            setState("error");
          }
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || "";
          if (cancelled) return;
          if (msg.toLowerCase().includes("already a member")) {
            const refetch = await fetchContest(joinCode);
            if (cancelled) return;
            if (refetch.success && refetch.contest) {
              setContest(refetch.contest);
              setIsMember(true);
              // Set liveIds for leaderboard
              if (refetch.contest?.live?.id) {
                useLiveQuizStore.getState().setLiveIds(refetch.contest.live.id, refetch.contest.id);
              }
              const hasLiveNow = !!refetch.contest?.live?.id;
              const isEndedNow = hasLiveNow && !!refetch.contest?.live?.endedAt;
              const isLiveNow = hasLiveNow && !isEndedNow;
              setState(isEndedNow ? "ended" : isLiveNow ? "live" : "waiting");
            } else {
              setError("Could not load contest");
              setState("error");
            }
          } else {
            setError(msg || "Failed to join contest");
            setState("error");
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        const msg = err.response?.data?.message || err.message || "Failed to load contest";
        if (err.response?.status === 404) setError("Contest not found");
        else if (err.response?.status === 403) setError("You don't have permission to access this contest");
        else setError(msg);
        setState("error");
      }
    }

    init();
    return () => { cancelled = true; };
  }, [joinCode, router, useDummy]);

  if (state === "error") {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
        <JoinNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl mx-auto p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => router.push("/home")}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-sm text-red-400 transition"
            >
              Go Back Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show leaderboard when contest has ended
  if (state === "ended" && contest) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
        <JoinNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Contest Ended
            </h1>
            <p className="text-neutral-400 text-center mb-6">
              {contest.title}
            </p>
            <div className="h-[400px] mb-6">
              <Leaderboard />
            </div>
            <button
              onClick={() => router.push("/home")}
              className="w-full px-4 py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // FIXED: When live, don't use the same layout - LiveContestView needs full control
  if (state === "live" && contest?.live?.id) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col">
        <JoinNavbar />
        {/* CHANGED: Removed overflow-hidden, let LiveContestView handle its own layout */}
        <div className="flex-1 min-h-0">
          <LiveContestView contestId={contest.id} liveContestId={contest.live.id} contest={contest} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
      <JoinNavbar />
      <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-6">
          {state === "loading" && <JoinLoader />}
          {state === "waiting" && contest && (
            <>
              <ContestInfo contest={contest} isMember={isMember} />
              <WaitingRoom
                contestId={contest.id}
                joinCode={joinCode}
                onGoLive={(liveContestId) => {
                  setContest((prev) => prev && liveContestId ? { ...prev, live: { id: liveContestId, currentIndex: 0, startedAt: prev.live?.startedAt ?? "", endedAt: null } } : prev);
                  setState("live");
                }}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}