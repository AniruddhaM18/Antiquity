
export type QuestionInput = {
  text: string
  options: string[]
  correct: number
  points: number
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  joinCode: string;
  createdAt: Date;
  questions: Question[];
  live?: {
    id: string;
    currentIndex?: number;
    startedAt?: string;
    endedAt?: string | null;
  } | null;
  members?: Array<{ userId: string; role?: string }>;
}


export interface Question {
  id: string
  contestId: string
  question: string
  options: string[]
  correct: number
  points: number
  contest?: Contest
}