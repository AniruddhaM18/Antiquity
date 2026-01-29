"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JoinByCodePage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  useEffect(() => {
    if (code) router.replace(`/live/${encodeURIComponent(code)}`);
  }, [code, router]);
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
      Redirecting to contest…
    </div>
  );
}