import {z} from "zod";

export const createUserValidation = z.object({
    name: z.string().min(4, { message: "Length must be greater than 4 characters" }),
    lastname: z.string().min(4, { message: "Length must be greater than 4 characters" }),
    mail: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Length must be greater than 8 characters" }),
})