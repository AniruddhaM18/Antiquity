"use client";

import { useEffect, useState } from "react";
import { fetchMyContests } from "@/lib/contestApi";
import ParticipatedContestCard from "./participatedCard";

type Contest = {
  id: string;
  title: string;
  description?: string | null;
  _count: {
    questions: number;
    members: number;
  };
  isCreator: boolean;
  userRole: "host" | "participant" | null;
  live: {
    isActive: boolean;
    endedAt: string | null;
  } | null;
};

export default function AttendedContestsSection() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await fetchMyContests();
      setContests(all.filter((c: { userRole: string; }) => c.userRole === "participant"));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading contests...</p>;
  }

  if (contests.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400">
        You haven’t participated in any contests yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contests.map(contest => (
        <ParticipatedContestCard
          key={contest.id}
          contest={contest}
        />
      ))}
    </div>
  );
}
