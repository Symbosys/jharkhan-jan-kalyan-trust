import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  position: z.string().min(2, "Position must be at least 2 characters").max(100, "Position is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  image: z.string().optional(), // Base64 or URL
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
