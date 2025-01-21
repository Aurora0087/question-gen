import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  userName: z.string().min(3, 'User Name Must be at least 3 characters').max(30, 'Must be under 30 characters'),
  password: z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
  confirmPassword: z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});
