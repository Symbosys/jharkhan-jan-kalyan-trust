import { z } from "zod";

export const gallerySchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  category: z.enum(["ACTIVITIES", "PRESS"]),
  image: z.string().optional(), // Base64 or URL
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
}).refine(data => {
  if (data.type === "IMAGE" && !data.image) return false;
  if (data.type === "VIDEO" && !data.videoUrl) return false;
  return true;
}, {
  message: "Either Image or Video URL is required based on type",
  path: ["image"]
});

export type GalleryInput = z.infer<typeof gallerySchema>;
