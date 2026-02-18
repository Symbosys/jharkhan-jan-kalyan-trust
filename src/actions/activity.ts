"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";

/**
 * Get activities with pagination
 */
export async function getAllActivities(page: number = 1, limit: number = 10) {
    "use cache";
    cacheTag("activity");
    const skip = (page - 1) * limit;
    try {
        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                skip,
                take: limit,
                orderBy: {
                    order: "asc",
                },
            }),
            prisma.activity.count(),
        ]);
        
        return {
            activities,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching activities:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Activity
 */
export async function createActivity(data: {
    title: string;
    description: string;
    type: "IMAGE" | "VIDEO";
    image?: string; // base64 or path
    videoUrl?: string;
    order?: number;
}) {
    try {
        let imageData = null;

        // Upload image if provided and type is IMAGE
        if (data.image) {
            const uploadResult = await uploadToCloudinary(data.image, "activities");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const activity = await prisma.activity.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                image: imageData as any,
                videoUrl: data.videoUrl,
                order: data.order || 0,
            },
        });

        updateTag("activity");
        return { success: true, data: activity };
    } catch (error: any) {
        console.error("Error creating activity:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing Activity
 */
export async function updateActivity(
    id: number,
    data: {
        title?: string;
        description?: string;
        type?: "IMAGE" | "VIDEO";
        image?: string;
        videoUrl?: string;
        order?: number;
    }
) {
    try {
        const existing = await prisma.activity.findUnique({
            where: { id },
        });

        if (!existing) throw new Error("Activity not found");

        let imageData = existing.image;

        if (data.image) {
            // Delete old image if exists
            const existingImageData = existing.image as any;
            if (existingImageData?.public_id) {
                await deleteFromCloudinary(existingImageData.public_id);
            }

            // Upload new
            const uploadResult = await uploadToCloudinary(data.image);
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.activity.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                image: imageData as any,
                videoUrl: data.videoUrl,
                order: data.order !== undefined ? data.order : existing.order,
            },
        });

        updateTag("activity");
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating activity:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete an Activity
 */
export async function deleteActivity(id: number) {
    try {
        const existing = await prisma.activity.findUnique({
            where: { id },
        });

        if (!existing) throw new Error("Activity not found");

        // Delete image from Cloudinary
        const imageData = existing.image as any;
        if (imageData?.public_id) {
            await deleteFromCloudinary(imageData.public_id);
        }

        await prisma.activity.delete({
            where: { id },
        });

        updateTag("activity");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting activity:", error);
        return { success: false, error: error.message };
    }
}
