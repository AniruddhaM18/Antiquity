import { z } from "zod";

export const addQuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string()).min(2).max(6),
  correct: z.number().int().min(0),
  points: z.number().int().min(1).default(10),
})

export const createContestSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(10),
  questions: z.array(addQuestionSchema).optional(),
})

export const addQuestionSSchema = z.object({
    questions : z.array(addQuestionSchema).min(1, "Atleast 1 question required")
}); 