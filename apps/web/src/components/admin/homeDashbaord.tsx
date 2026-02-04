"use client";

import { Plus, Settings } from "lucide-react";
import { ButtonWithForm } from "./mcqContestCard";
import { JoinContestButton } from "./joinContestButton";
import ContestSection from "./contestSection";

export default function HomeDashboard() {
  return (
    <div className="p-6 space-y-6">
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

      {/* Create / Join */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900">
          <ButtonWithForm />
        </div>

        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900">
          <JoinContestButton />
        </div>
      </div>


      <ContestSection />
    </div>
  );
}
