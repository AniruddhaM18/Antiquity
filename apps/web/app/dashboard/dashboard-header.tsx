"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";

const PATH_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/contests": "Participated Contests",
    "/dashboard/created": "Created Contests",
    "/dashboard/quizzes": "My Quizzes",
}

function getTitle(pathname: string): string {
    if(PATH_TITLES[pathname]) return PATH_TITLES[pathname];
    if(pathname.startsWith("dashboard/quiz/")) return "Quiz";
    return "Dashboard";
}

export function DashboardHeader() {
      const pathname = usePathname();
      const title = getTitle(pathname);

        return (
    <header className="h-14 flex items-center gap-3 px-3 border-b border-neutral-800">
      <SidebarTrigger className="h-9 w-9">
        <TbLayoutSidebarRightCollapse className="size-5" />
      </SidebarTrigger>
      <h1 className="text-lg font-semibold text-neutral-100 truncate">
        {title}
      </h1>
    </header>
  );

}