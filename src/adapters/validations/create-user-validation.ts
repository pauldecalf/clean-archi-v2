import {z} from "zod";

export const createUserValidation = z.object({
    name: z.string(),
    lastName: z.string(),
    mail: z.string(),
    password: z.string(),
})