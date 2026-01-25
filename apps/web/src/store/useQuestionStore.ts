import { create } from "zustand";
import { nanoid } from "nanoid";
import { Contest, Question } from "../components/types";

//dummy
const getDummyQuestions = (): Question[] => [
    {
        id: nanoid(),
        contestId: "",
        question: "What is the capital of India?",
        options: [
            "Mumbai",
            "Delhi",
            "Kolkata",
            "Chennai",
        ],
        correct: 1,
        points: 10,
    },
    {
        id: nanoid(),
        contestId: "",
        question: "Which language is used with React?",
        options: [
            "Python",
            "Java",
            "JavaScript",
            "C++",
        ],
        correct: 2,
        points: 10,
    },
    {
        id: nanoid(),
        contestId: "",
        question: "What does HTTP stand for?",
        options: [
            "HyperText Transfer Protocol",
            "High Transfer Text Program",
            "Hyper Transfer Tool Process",
            "None",
        ],
        correct: 0,
        points: 10,
    },
]


export interface QuestionValue {
    id: string
    question: string
    options: string[]
    correct: number
    points: number
}
const getNewQuestion = (): Question => ({
    id: nanoid(),
    contestId: "",
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    points: 10,
})

interface ContestState {
    contest: Contest
    addQuestion: () => void
    updateQuestion: (id: string, data: Partial<QuestionValue>) => void
    deleteQuestion: (id: string) => void,
    currentViewingIndex: number,
    setCurrentViewingIndex: (id: number) => void
}

export const useQuestionStore = create<ContestState>((set) => ({
    contest: {
        id: nanoid(),
        title: "",
        description: "",
        createdAt: new Date(),
        createdBy: "",
        joinCode: "",
        questions: getDummyQuestions()
    },

    addQuestion() {
        set((state) => ({
            contest: { ...state.contest, questions: [...state.contest.questions, getNewQuestion()] }
        }))
    },

    updateQuestion(id: string, data: Partial<Question>) {
        set((state) => ({
            contest: {
                ...state.contest,
                questions: state.contest.questions.map((q) =>
                    q.id === id ? { ...q, ...data } : q
                ),
            },
        }))
    },

    deleteQuestion(id: string) {
        set((state) => ({
            contest: { ...state.contest, questions: [...state.contest.questions.filter((q) => q.id !== id)] }
        }))
    },

    currentViewingIndex: 0,
    setCurrentViewingIndex: (id: number) => {
        set((state) => ({
            currentViewingIndex: id
        }))
    }
}))



