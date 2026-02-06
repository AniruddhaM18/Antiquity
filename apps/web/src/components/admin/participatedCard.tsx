"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export default function ParticipatedContestCard({
  contest,
}: {
  contest: Contest;
}) {
  const status: "LIVE" | "ENDED" | "PARTICIPATED" = contest.live
    ? contest.live.isActive
      ? "LIVE"
      : "ENDED"
    : "PARTICIPATED";

  const statusBarColor =
    status === "LIVE"
      ? "bg-green-500"
      : status === "ENDED"
      ? "bg-red-500"
      : "bg-[#e86a40]";

 const roleLabel =
    contest.userRole === "host"
      ? "Host"
      : contest.userRole === "participant"
      ? "Participant"
      : "Viewer";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
    >
      <div className="flex gap-3">
        {/* FLOATING STATUS BAR */}
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-stretch">
                <div
                  className={`
                    w-1
                    rounded-full
                    ${statusBarColor}
                    my-1
                    cursor-default
                  `}
                />
              </div>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              sideOffset={6}
              className="text-[10px] px-2 py-1"
            >
              {status}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* CONTENT */}
        <div className="flex-1 space-y-3">
          <h3 className="font-medium text-neutral-100">
            {contest.title}
          </h3>

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
            Role: {roleLabel}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
