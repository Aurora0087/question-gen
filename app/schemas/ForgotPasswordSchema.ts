import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email')
});

export const forgotPasswordValidateSchema = z.object({
    password: z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
    confirmPassword: z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});