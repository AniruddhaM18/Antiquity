import z from "zod";

export const createContestSchema = z.object({
    title: z.string().min(4, "Title must me 4 characters"),
    description : z.string().min(10)
});

export const addQuestionSchema = z.object({
    text: z.string(),
    options: z.array(z.string()).min(2, "Atleast 2 options required").max(6, "Maximum 6 options allowed"),
    correct: z.number().int().min(0), //correct answer index must be valid
    points: z.number().int().min(1).default(10)
});

export const addQuestionSSchema = z.object({
    questions : z.array(addQuestionSchema).min(1, "Atleast 1 question required")
}); 