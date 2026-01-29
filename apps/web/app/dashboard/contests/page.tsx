"use client";

import AttendedContestsSection from "@/src/components/admin/attendedContests";



export default function DashboardContestsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-neutral-100">
        Participated Contests
      </h1>

      <AttendedContestsSection />
    </div>
  );
}
