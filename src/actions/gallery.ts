"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";

import { GalleryCategory, GalleryType, Prisma } from "../../generated/prisma/client";

/**
 * Get gallery items with pagination and filtering
 */
export async function getAllGalleryItems(options?: { 
    page?: number; 
    limit?: number; 
    category?: GalleryCategory; 
    type?: GalleryType 
}) {
    "use cache";
    cacheTag("gallery");
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.GalleryWhereInput = {};
    if (options?.category) where.category = options.category;
    if (options?.type) where.type = options.type;

    try {
        const [items, total] = await Promise.all([
            prisma.gallery.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.gallery.count({ where }),
        ]);

        return {
            items,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching gallery items:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Gallery item
 */
export async function createGalleryItem(data: {
    image?: string;
    videoUrl?: string;
    type: "IMAGE" | "VIDEO";
    category: "ACTIVITIES" | "PRESS";
}) {
    try {
        let imageData = null;

        if (data.type === "IMAGE" && data.image) {
            const uploadResult = await uploadToCloudinary(data.image, "gallery");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const item = await prisma.gallery.create({
            data: {
                image: imageData as any,
                videoUrl: data.videoUrl,
                type: data.type,
                category: data.category,
            },
        });

        updateTag("gallery");
        return { success: true, data: item };
    } catch (error: any) {
        console.error("Error creating gallery item:", error);
        return { success: false, error: error.message || "Failed to create gallery item" };
    }
}

/**
 * Update an existing Gallery item
 */
export async function updateGalleryItem(
    id: number,
    data: {
        image?: string;
        videoUrl?: string;
        type?: "IMAGE" | "VIDEO";
        category?: "ACTIVITIES" | "PRESS";
    }
) {
    try {
        const existing = await prisma.gallery.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Gallery item not found" };
        }

        let imageData = existing.image;

        if (data.image) {
            // Delete old image if exists
            const existingImageData = existing.image as any;
            if (existingImageData?.public_id) {
                try {
                    await deleteFromCloudinary(existingImageData.public_id);
                } catch (cloudinaryError) {
                    console.error("Error deleting old image:", cloudinaryError);
                }
            }

            // Upload new
            const uploadResult = await uploadToCloudinary(data.image, "gallery");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.gallery.update({
            where: { id },
            data: {
                image: imageData as any,
                videoUrl: data.videoUrl,
                type: data.type,
                category: data.category,
            },
        });

        updateTag("gallery");
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating gallery item:", error);
        return { success: false, error: error.message || "Failed to update gallery item" };
    }
}

/**
 * Delete a Gallery item
 */
export async function deleteGalleryItem(id: number) {
    try {
        const existing = await prisma.gallery.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Gallery item not found" };
        }

        const imageData = existing.image as any;
        if (imageData?.public_id) {
            try {
                await deleteFromCloudinary(imageData.public_id);
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
            }
        }

        await prisma.gallery.delete({
            where: { id },
        });

        updateTag("gallery");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting gallery item:", error);
        return { success: false, error: error.message || "Failed to delete gallery item" };
    }
}
