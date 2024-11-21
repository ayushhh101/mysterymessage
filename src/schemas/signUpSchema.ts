import {z} from 'zod'

export const usernameValidation = z
  .string()
  .min(2, "Must be atleast 2 Characters")
  .max(20, "Must be no more than 20 Characters")
  .regex(/^[a-zA-Z0-9_]+$/,"Must not contain special character")

export const signUpSchema = z.object({
  username : usernameValidation,
  email : z.string().email({message:"Invalid email address"}),
  password : z.string().min(6 ,{message:"Must be atleast 6 Characters"})
})