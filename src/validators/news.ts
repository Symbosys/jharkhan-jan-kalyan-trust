import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Invalid link URL").optional().or(z.literal("")),
});

export type NewsInput = z.infer<typeof newsSchema>;
