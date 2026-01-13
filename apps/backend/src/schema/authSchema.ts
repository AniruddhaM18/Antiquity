import { z } from "zod";

export const signupSchema = z.object({
    name:z.string(),
    email: z.string(),
    password: z.string().min(6),
    role: z.enum(["admin","user"]).optional()
});

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});
