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
  joinCode?: string
}

interface QuestionStore {
  contest: Contest
  currentViewingIndex: number

  setCurrentViewingIndex: (index: number) => void
  setContestTitle: (title: string) => void
  setContestDescription: (description: string) => void

  addQuestion: () => void
  updateQuestion: (id: string, data: Partial<QuestionValue>) => void
  deleteQuestion: (id: string) => void

  createContest: () => Promise<string | undefined>
  saveQuestions: () => Promise<string | undefined>
  loadContest: (contestId: string) => Promise<void>
}

function createEmptyContest(): Contest {
  return {
    id: nanoid(),
    title: "",
    description: "",
    questions: [],
    isPersisted: false,
  }
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  contest: createEmptyContest(),
  currentViewingIndex: 0,

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

  async createContest() {
    const { contest } = get()

    if (contest.isPersisted) return contest.joinCode
    if (!contest.title.trim()) return undefined

    const res = await api.post(`/contests/create/${contest.id}`, {
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
      contest: {
        ...state.contest,
        isPersisted: true,
        joinCode: res.data.joinCode,
      },
    }))

    return res.data.joinCode
  },

  async saveQuestions() {
    const { contest, createContest } = get()

    let joinCode = contest.joinCode

    if (!contest.isPersisted) {
      joinCode = await createContest()
    }

    const latest = get().contest
    if (!latest.isPersisted) return joinCode

    await api.post(`/contests/add/${latest.id}/questions`, {
      questions: latest.questions.map((q) => ({
        text: q.question,
        options: q.options,
        correct: q.correct,
        points: q.points,
      })),
    })

    return joinCode
  },

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
          joinCode: res.data.contest.joinCode, //IMPORTANT
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
