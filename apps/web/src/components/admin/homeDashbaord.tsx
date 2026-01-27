"use client";

import { Plus, Settings } from "lucide-react";
import { ButtonWithForm } from "./mcqContestCard";
import { JoinContestButton } from "./joinContestButton";
import { Button } from "@/components/ui/button";

export default function HomeDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-100">
          Home
        </h1>

        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-md border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition">
            <Plus className="size-4 inline mr-2" />
            New
          </button>

          <button className="h-9 px-4 rounded-md border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition">
            <Settings className="size-4 inline mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Info / Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900">
          <ButtonWithForm />
        </div>

        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900">
          <JoinContestButton />
        </div>

      </div>

      {/* Generic Content Area */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 h-64 flex items-center justify-center text-neutral-500">
        Drop any component here
      </div>
    </div>
  );
}