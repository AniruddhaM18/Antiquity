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
  id: string
  question: string
  options: string[]
  correct?: number  // Only available for hosts
}

export interface LiveContest {
  id: string
  title: string
  questions: LiveQuestion[]
}

interface LiveQuizStore {
  contest: LiveContest | null
  currentIndex: number
  serverCurrentIndex: number
  answers: Record<string, number>
  locked: boolean
  liveContestId: string | null
  contestId: string | null
  leaderboardVersion: number
    // Incrementing this triggers leaderboard refresh

  // actions
  setContest: (contest: LiveContest) => void
  setLiveIds: (liveContestId: string, contestId: string) => void
  selectAnswer: (questionId: string, optionIndex: number) => void
  next: () => void
  previous: () => void
  setCurrentIndex: (index: number) => void
  setServerCurrentIndex: (index: number) => void
  lock: () => void
  triggerLeaderboardRefresh: () => void
  nextQuestion: () => void
  endContest: () => void
}

export const useLiveQuizStore = create<LiveQuizStore>((set, get) => ({
  contest: null,
  currentIndex: 0,
  serverCurrentIndex: 0,
  answers: {},
  locked: false,
  liveContestId: null,
  contestId: null,
  leaderboardVersion: 0,

  setContest(contest) {
    const state = get()
    // Only reset navigation state on initial load (when no contest exists)
    if (state.contest === null) {
      set({
        contest,
        currentIndex: 0,
        serverCurrentIndex: 0,
        answers: {},
        locked: false,
      })
    } else {
      // Just update the contest, preserve navigation state
      set({ contest })
    }
  },

  setLiveIds(liveContestId, contestId) {
    set({ liveContestId, contestId })
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

  setServerCurrentIndex(index) {
    const { contest } = get()
    if (!contest) return

    if (index >= 0 && index < contest.questions.length) {
      // Only update serverCurrentIndex - don't touch currentIndex
      // Participants navigate independently
      set({ serverCurrentIndex: index })
    }
  },

  lock() {
    set({ locked: true })
  },

  triggerLeaderboardRefresh() {
    set((state) => ({ leaderboardVersion: state.leaderboardVersion + 1 }))
  },
  nextQuestion() {
  const { contest, currentIndex } = get()
  if (!contest) return

  if (currentIndex < contest.questions.length - 1) {
    set({ currentIndex: currentIndex + 1 })
  }
},

endContest() {
  set({
    locked: true,
  })
},

}))
