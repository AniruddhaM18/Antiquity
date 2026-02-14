"use client"
import { IoChevronBackOutline } from "react-icons/io5";
import { useQuestionStore } from "@/src/store/useQuestionStore"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils";

export default function NewSidebar() {
    const router = useRouter()

    const {
        contest,
        addQuestion,
        currentViewingIndex,
        setCurrentViewingIndex,
    } = useQuestionStore()

    const questions = contest.questions

    return (
        <aside className="w-72 h-auto bg-neutral-950 p-4 flex flex-col gap-3 border-r border-neutral-800 cursor-pointer">
            {/* HOME */}
            {/* <button
                onClick={() => router.push("/dashboard")}
                className="w-full inline-flex items-center gap-2 text-left px-3 py-2 text-sm rounded border border-neutral-700 hover:bg-neutral-800 transition"
            >
                <IoChevronBackOutline className="" />
                Home
            </button> */}
            {/* <div className="flex items-center text-left gap-2 px-2 mt-1 mb-1">
                <button
                    onClick={() => router.push("/dashboard")} className="h-6 w-6 rounded-sm flex items-center justify-center p-1 text-neutral-300  bg-neutral-700  text-sm hover:bg-neutral-800 transition">
                    <IoChevronBackOutline className="size-5" />
                </button>
                <span className="text-left"> Home </span>
            </div> */}

            <div className="flex items-center justify-between px-2 py-1 mt-1 mb-1">
                <span> Add Questions </span>
                <button
                    onClick={addQuestion}
                    className="h-6 w-6 rounded-sm flex items-center justify-center p-1 text-neutral-300  bg-neutral-700  text-sm hover:bg-neutral-800 transition">
                    <Plus className="size-5" />
                </button>
            </div>



            {/* QUESTIONS LIST */}
            <div className="pt-2 flex-1 overflow-hidden">
                <p className="text-xs text-neutral-500 mb-2 px-2">
                    Questions ({questions.length})
                </p>

                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
                    {questions.map((q, i) => {
                        const isActive = currentViewingIndex === i
                        const optionsVerified = q.options.every(op=> op);
                        const questionVerified = q.question.trim()
                        const verified = optionsVerified && questionVerified;
                        return (
                            <div
                                key={q.id}
                                onClick={() => setCurrentViewingIndex(i)}
                                className={cn("w-full h-24  p-4.5 rounded text-sm border transition border-neutral-800/80 hover:bg-neutral-900/40",
                                    isActive && "border border-orange-600/80"
                                )}>
                                <div className="flex items-start justify-between font-medium gap-1">
                                    <span>Question {i + 1}</span>
                   
                                    {verified && (
                                        <span className="text-xs text-green-500">✓</span>
                                    )}
                                </div>
                                <div className="mt-2"> 
                                    <span className="text-neutral-400 font-normal">
                                        {q.question
                                            ?.trim()
                                            .split(/\s+/)
                                            .slice(0, 4)
                                            .join(" ")}...
                                    </span>
                                    </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </aside>
    )
}
