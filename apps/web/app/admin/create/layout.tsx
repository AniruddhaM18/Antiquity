import { QuizNavbar } from "@/src/components/admin/quizNavbar"

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col bg-neutral-950 text-neutral-200">
      {/* Top Navbar */}
      <QuizNavbar />

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
