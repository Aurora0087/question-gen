import { z } from "zod";

export const EditMcqPaperSchema = z.object({
    newTitle: z.string().min(2, 'Must be at least 2 characters'),
  });