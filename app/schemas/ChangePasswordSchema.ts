import { z } from "zod";

export const ChangePasswordSchema = z.object({
  oldPassword:z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
  newPassword: z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
  confirmPassword: z.string().min(3, 'Must be at least 3 characters').max(256, 'Must be under 256 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});
