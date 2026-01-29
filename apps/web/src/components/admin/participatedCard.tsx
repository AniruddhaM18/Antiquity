"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type Contest = {
  id: string;
  title: string;
  description?: string | null;
  _count: {
    questions: number;
    members: number;
  };
  userRole: "host" | "participant" | null;
  live: {
    isActive: boolean;
    endedAt: string | null;
  } | null;
};

export default function ParticipatedContestCard({ contest }: { contest: Contest }) {
  const status = contest.live
    ? contest.live.isActive
      ? "LIVE"
      : "ENDED"
    : "UPCOMING";

  const statusColor =
    status === "LIVE"
      ? "bg-green-600"
      : status === "ENDED"
        ? "bg-red-600"
        : "bg-neutral-700";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-neutral-100">
          {contest.title}
        </h3>

        <Badge className={`${statusColor} text-white`}>
          {status}
        </Badge>
      </div>

      {contest.description && (
        <p className="text-sm text-neutral-400 line-clamp-2">
          {contest.description}
        </p>
      )}

      <div className="flex justify-between text-xs text-neutral-500">
        <span>{contest._count.questions} Questions</span>
        <span>{contest._count.members} Players</span>
      </div>

      <div className="text-xs text-neutral-400">
        Role: Participant
      </div>
    </motion.div>
  );
}
