"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createId } from "@paralleldrive/cuid2"

export function ButtonWithForm() {
  const router = useRouter()

  function handleCreateQuiz() {
    const id = createId()
    router.push(`/new/${id}`)
  }

  return (
    <div className="space-y-4">
      <Button
        className="
          bg-neutral-300 text-black
          shadow-none
          hover:bg-neutral-300 hover:shadow-none
          focus-visible:ring-0 focus-visible:ring-offset-0
          active:shadow-none
        "
        onClick={handleCreateQuiz}
      >
        Create Quiz
      </Button>
    </div>
  )
}
