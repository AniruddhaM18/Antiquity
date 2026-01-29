"use client";

import { Users, FileText, Radio } from "lucide-react";

type Contest = {
  id: string;
  title: string;
  _count: {
    questions: number;
    members: number;
  };
  isCreator: boolean;
  live: {
    isActive: boolean;
    endedAt: string | null;
  } | null;
};

export default function ContestCard({ contest }: { contest: Contest }) {
  const status = contest.live
    ? contest.live.isActive
      ? "Live"
      : "Ended"
    : "Upcoming";

  return (
    <div className="p-4 rounded-sm border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition">
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-neutral-100">
          {contest.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded ${
            status === "Live"
              ? "bg-red-500/10 text-red-400"
              : status === "Ended"
              ? "bg-neutral-700 text-neutral-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-3 flex gap-4 text-sm text-neutral-400">
        <div className="flex items-center gap-1">
          <FileText className="size-4" />
          {contest._count.questions}
        </div>

        <div className="flex items-center gap-1">
          <Users className="size-4" />
          {contest._count.members}
        </div>

        {contest.isCreator && (
          <div className="flex items-center gap-1 text-neutral-300">
            <Radio className="size-4" />
            Host
          </div>
        )}
      </div>
    </div>
  );
}
