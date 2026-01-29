import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PanelLeft } from "lucide-react";
import HomeDashboard from "./homeDashbaord";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="h-14 flex items-center gap-2 px-3 border-b border-neutral-800">
          <SidebarTrigger className="h-9 w-9">
            <PanelLeft className="size-5" />
          </SidebarTrigger>
        </header>

        <main>
            <HomeDashboard />
        </main>

      </SidebarInset>
    </SidebarProvider>


    </div>

  );
}
