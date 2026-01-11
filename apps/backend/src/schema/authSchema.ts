import z, { email } from "zod";

export const signupSchema = z.object({
    name:z.string(),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["admin","user"])
});

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});
