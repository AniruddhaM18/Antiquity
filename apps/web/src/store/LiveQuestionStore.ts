"use client"
import { create } from "zustand";

const mockContest = {
  id: "contest-1",
  title: "Demo Quiz",
  questions: [
    {
      id: "q1",
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    },
    {
      id: "q2",
      question: "2 + 2 equals?",
      options: ["3", "4", "5", "6"],
    },
    {
      id: "q3",
      question: "Which planet is known as Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
    },
  ],
}


export interface LiveQuestion {
    id: string,
    question: string,
    options: string[]
}

export interface LiveContest {
    id: string,
    title: string, 
    questions: LiveQuestion[]
}

interface LiveQuizStore {
  contest: LiveContest | null
  currentIndex: number
  answers: Record<string, number>
  locked: boolean

  // actions
  setContest: (contest: LiveContest) => void
  selectAnswer: (questionId: string, optionIndex: number) => void
  next: () => void
  previous: () => void
  setCurrentIndex: (index: number) => void
  lock: () => void
}


export const useLiveQuizStore = create<LiveQuizStore>((set, get) => ({
  contest: null,
  currentIndex: 0,
  answers: {},
  locked: false,

  setContest(contest) {
    set({ contest, currentIndex: 0, answers: {}, locked: false })
  },

  selectAnswer(questionId, optionIndex) {
    if (get().locked) return

    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionIndex,
      },
    }))
  },

  next() {
    const { contest, currentIndex } = get()
    if (!contest) return

    if (currentIndex < contest.questions.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
  },

  previous() {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 })
    }
  },

  setCurrentIndex(index) {
    const { contest } = get()
    if (!contest) return

    if (index >= 0 && index < contest.questions.length) {
      set({ currentIndex: index })
    }
  },

  lock() {
    set({ locked: true })
  },
}))
