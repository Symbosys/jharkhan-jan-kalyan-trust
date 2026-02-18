import { z } from "zod";

export const activitySchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(1, "Description is required"),
    type: z.enum(["IMAGE", "VIDEO"]),
    image: z.string().optional().or(z.literal("")),
    videoUrl: z.string().optional().or(z.literal("")),
    order: z.number().int().optional(),
}).superRefine((data, ctx) => {
    if (data.type === "VIDEO" && (!data.videoUrl || data.videoUrl.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Video URL is required for Video type",
            path: ["videoUrl"],
        });
    }
    if (data.videoUrl && data.videoUrl.trim() !== "") {
        try {
            new URL(data.videoUrl);
        } catch {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid URL",
                path: ["videoUrl"],
            });
        }
    }
});

export type ActivityInput = z.infer<typeof activitySchema>;
