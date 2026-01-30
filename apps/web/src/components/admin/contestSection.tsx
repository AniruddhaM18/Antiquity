"use client";

import { useEffect, useState } from "react";
import { fetchMyContests } from "@/lib/contestApi";
import CreatedContestCard, { Contest } from "./createdContestCard";

export default function CreatedContestsSection() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchMyContests();
        setContests(all);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading contests...</p>;
  }

  if (contests.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400">
        You haven’t created any contests yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contests.map((contest) => (
        <CreatedContestCard
          key={contest.id}
          contest={contest}
        />
      ))}
    </div>
  );
}
