import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BsLightningCharge } from "react-icons/bs";


export function SiteHeader() {
  return (
    <header
      className="
        sticky top-0 z-10
        flex h-(--header-height) items-center
        bg-neutral-950
        border-b border-white/5
      "
    >
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 text-neutral-200 hover:bg-neutral-500" />

        <Separator orientation="vertical" className="h-4 bg-white/10 mx-2" />

        <h1 className="text-sm font-medium text-neutral-200">
          Documents
        </h1>

        <div className="ml-auto">
          <button className="neo-btn h-8 flex items-center justify-center">
            Launch Contest
            {/* <BsLightningCharge className="ml-2 text-amber-200" /> */}
          </button>
        </div>
      </div>
    </header>
  )
}
