
export type QuestionInput = {
  text: string
  options: string[]
  correct: number
  points: number
}

export type Contest = {
  id: string
  title: string
  duration: number // minutes
}

