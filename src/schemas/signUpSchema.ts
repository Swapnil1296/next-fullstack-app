import { z } from "zod";


export const usernameValidation = z
    .string()
    .min(2, "user name must be atleast 2 character")
    .max(20, "user name must not be greater 20 character")
    .regex(/^[a-zA-Z0-9_]+$/,"user name must not contain any special character"
)
    
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "password must atleast 6 characters" }),
    
})
