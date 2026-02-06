"use client";

import { ButtonWithForm } from "./mcqContestCard";
import { JoinContestButton } from "./joinContestButton";
import ContestSection from "./contestSection";

export default function HomeDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <ButtonWithForm />

        {/* Right actions */}
        <div className="relative">
          <JoinContestButton />
        </div>
      </div>

      <ContestSection />
    </div>
  );
}
