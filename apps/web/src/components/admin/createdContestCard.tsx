"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteContest } from "@/lib/contestApi";

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
  onDelete?: () => void;
};

export default function CreatedContestCard({ contest, onDelete }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this contest?")) return;

    setDeleting(true);
    try {
      await deleteContest(contest.id);
      onDelete?.();
    } catch (err: any) {
      alert(err.message || "Failed to delete contest");
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/new/${contest.id}`);
    setMenuOpen(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/new/${contest.id}`)}
      className="relative cursor-pointer rounded-sm border border-neutral-800 bg-neutral-900 p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-neutral-100 pr-8">
          {contest.title}
        </h3>

        <div className="flex items-center gap-2">
          <Badge className={`${statusColor} text-white rounded-sm`}>
            {status}
          </Badge>

          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded hover:bg-neutral-800 transition"
            >
              <MoreVertical size={16} className="text-neutral-400" />
            </button>

            {menuOpen && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />

                {/* Dropdown menu */}
                <div className="absolute right-0 top-8 z-20 w-32 bg-neutral-800 border border-neutral-700 rounded-sm shadow-lg overflow-hidden">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-neutral-700 transition disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
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

