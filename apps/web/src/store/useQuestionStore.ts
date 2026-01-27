import { create } from "zustand"
import { nanoid } from "nanoid"
import { api } from "@/lib/api"

export interface QuestionValue {
  id: string
  question: string
  options: string[]
  correct: number
  points: number
}

export interface Contest {
  id: string
  title: string
  description?: string
  questions: QuestionValue[]
  isPersisted: boolean
}

interface QuestionStore {
  contest: Contest
  currentViewingIndex: number

  // navigation
  setCurrentViewingIndex: (index: number) => void

  // contest meta
  setContestTitle: (title: string) => void
  setContestDescription: (description: string) => void

  // local question editing
  addQuestion: () => void
  updateQuestion: (id: string, data: Partial<QuestionValue>) => void
  deleteQuestion: (id: string) => void

  // backend
  createContest: () => Promise<void>
  saveQuestions: () => Promise<void>
  loadContest: (contestId: string) => Promise<void>
}


function createEmptyContest(): Contest {
  return {
    id: nanoid(), // frontend owns ID
    title: "",
    description: "",
    questions: [],
    isPersisted: false,
  }
}


export const useQuestionStore = create<QuestionStore>((set, get) => ({
//state
    contest: createEmptyContest(),
  currentViewingIndex: 0,

  //navigarion
  setCurrentViewingIndex(index) {
    set({ currentViewingIndex: index })
  },

 
  setContestTitle(title) {
    set((state) => ({
      contest: { ...state.contest, title },
    }))
  },

  setContestDescription(description) {
    set((state) => ({
      contest: { ...state.contest, description },
    }))
  },

  addQuestion() {
    set((state) => {
      const next = [
        ...state.contest.questions,
        {
          id: nanoid(),
          question: "",
          options: ["", ""],
          correct: 0,
          points: 10,
        },
      ]

      return {
        contest: { ...state.contest, questions: next },
        currentViewingIndex: next.length - 1,
      }
    })
  },

  updateQuestion(id, data) {
    set((state) => ({
      contest: {
        ...state.contest,
        questions: state.contest.questions.map((q) =>
          q.id === id ? { ...q, ...data } : q
        ),
      },
    }))
  },

  deleteQuestion(id) {
    set((state) => {
      const next = state.contest.questions.filter((q) => q.id !== id)

      return {
        contest: { ...state.contest, questions: next },
        currentViewingIndex: Math.max(
          0,
          Math.min(state.currentViewingIndex, next.length - 1)
        ),
      }
    })
  },


  // CREATE contest + questions (ONE TIME)
  async createContest() {
    const { contest } = get()

    if (contest.isPersisted) return
    if (!contest.title.trim()) return

    await api.post(`/contests/create/${contest.id}`, {
      title: contest.title,
      description: contest.description,
      questions: contest.questions.map((q) => ({
        text: q.question,
        options: q.options,
        correct: q.correct,
        points: q.points,
      })),
    })

    set((state) => ({
      contest: { ...state.contest, isPersisted: true },
    }))
  },

  // UPDATE questions only (host-only)
  async saveQuestions() {
    const { contest, createContest } = get()

    if (!contest.isPersisted) {
      await createContest()
    }

    const latest = get().contest
    if (!latest.isPersisted) return

    await api.post(`/contests/add/${latest.id}/questions`, {
      questions: latest.questions.map((q) => ({
        text: q.question,
        options: q.options,
        correct: q.correct,
        points: q.points,
      })),
    })
  },

  // LOAD or INIT draft
  async loadContest(contestId: string) {
    try {
      const res = await api.get(`/contests/get/${contestId}`)

      set({
        contest: {
          id: res.data.contest.id,
          title: res.data.contest.title ?? "",
          description: res.data.contest.description ?? "",
          questions: res.data.contest.questions.map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct ?? 0,
            points: q.points,
          })),
          isPersisted: true,
        },
        currentViewingIndex: 0,
      })
    } catch (err: any) {
      if (err?.response?.status === 404) {
        set({
          contest: {
            ...createEmptyContest(),
            id: contestId,
          },
          currentViewingIndex: 0,
        })
        return
      }

      throw err
    }
  },
}))
