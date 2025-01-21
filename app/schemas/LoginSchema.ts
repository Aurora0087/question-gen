import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(3, 'Must be at least 3 characters')
  });