import { Button } from "@/components/ui/button";
import { useQuestionStore } from "@/src/store/useQuestionStore"
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";



export default function QuestionNavigation(){
    const questions = useQuestionStore((q) => q.contest.questions);
    const currentViewingIndex = useQuestionStore((q) => q.currentViewingIndex);
    const setCurrentQuestionIndex = useQuestionStore((q) => q.setCurrentViewingIndex)

    if(questions.length === 0) return null

    const previousQuestion = () => {
        if(currentViewingIndex > 0) {
            setCurrentQuestionIndex(currentViewingIndex -1)
        }
    }

    const nextQuestion = () => {
        if(currentViewingIndex < questions.length -1) {
            setCurrentQuestionIndex(currentViewingIndex + 1)
        }
    }

    return (
        <div className="border-t border-neutral-900 p-4 flex items-center justify-between ">
            <Button onClick={previousQuestion}
            disabled={currentViewingIndex === 0}
            className="flex items-center px-4 py-2 gap-2 bg-transparent text-neutral-300 rounded-sm border border-neutral-800 hover:bg-neutral-900 disabled:opacity-50 "
            >
               <FaChevronLeft /> Previous
            </Button>
            <div className="text-sm text-neutral-400">
                Question {currentViewingIndex + 1} of {questions.length}
            </div>

            <Button onClick={nextQuestion}
            disabled={currentViewingIndex === questions.length -1}
            className="flex items-center px-4 py-2 gap-2 bg-transparent text-neutral-300 rounded-sm border border-neutral-800 hover:bg-neutral-900 disabled:opacity-50">
                Next <FaChevronRight />
            </Button>
        </div>
    )
}