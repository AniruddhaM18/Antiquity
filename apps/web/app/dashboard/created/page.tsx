"use client";

import CreatedContestsSection from "@/src/components/admin/createdContest";


export default function DashboardCreatedContestsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-neutral-100">
        Created Contests
      </h1>

      <CreatedContestsSection />
    </div>
  );
}
