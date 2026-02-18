import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().optional(), // Base64 or URL
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
});

export type NewsInput = z.infer<typeof newsSchema>;
