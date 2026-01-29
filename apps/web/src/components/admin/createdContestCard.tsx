"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export type Contest = {
  id: string;
  title: string;
  description?: string | null;
  createdBy: string;
  joinCode: string;
  createdAt: string;
  _count: {
    questions: number;
    members: number;
  };
  live: {
    isActive: boolean;
    endedAt: string | null;
  } | null;
};

type Props = {
  contest: Contest;
};

export default function CreatedContestCard({ contest }: Props) {
  const router = useRouter();

  const status = contest.live
    ? contest.live.isActive
      ? "LIVE"
      : "ENDED"
    : "DRAFT";

  const statusColor =
    status === "LIVE"
      ? "bg-green-600"
      : status === "ENDED"
      ? "bg-red-600"
      : "bg-yellow-600";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/new/${contest.id}`)}
      className="cursor-pointer rounded-sm border border-neutral-800 bg-neutral-900 p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-neutral-100">
          {contest.title}
        </h3>

        <Badge className={`${statusColor} text-white rounded-sm`}>
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
        Join Code: <span className="font-mono">{contest.joinCode}</span>
      </div>
    </motion.div>
  );
}
