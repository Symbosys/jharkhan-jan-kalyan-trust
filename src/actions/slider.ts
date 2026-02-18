"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Get all sliders with pagination
 */
export async function getAllSliders(page: number = 1, limit: number = 10) {
    "use cache";
    cacheTag("slider");
    const skip = (page - 1) * limit;

    try {
        const [sliders, total] = await Promise.all([
            prisma.sliderImage.findMany({
                skip,
                take: limit,
                orderBy: {
                    order: "asc",
                },
            }),
            prisma.sliderImage.count(),
        ]);

        return {
            sliders,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching sliders:", error);
        throw new Error(error.message || "Failed to fetch sliders");
    }
}

/**
 * Get a specific slider by ID
 */
export async function getSliderById(id: number) {
    "use cache";
    cacheTag(`slider-${id}`);
    try {
        const slider = await prisma.sliderImage.findUnique({
            where: { id },
        });
        if (!slider) throw new Error("Slider not found");
        return slider;
    } catch (error: any) {
        console.error(`Error fetching slider ${id}:`, error);
        throw new Error(error.message || "Failed to fetch slider");
    }
}

/**
 * Create a new Slider
 */
export async function createSlider(data: {
    image: string; // base64 or path
    order?: number;
}) {
    try {
        if (!data.image) {
            return { success: false, error: "Image is required" };
        }

        const uploadResult = await uploadToCloudinary(data.image, "sliders");

        const slider = await prisma.sliderImage.create({
            data: {
                image: {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                },
                order: data.order || 0,
            },
        });

        updateTag("slider");
        return { success: true, data: slider };
    } catch (error: any) {
        console.error("Error creating slider:", error);
        return { success: false, error: error.message || "Failed to create slider" };
    }
}

/**
 * Update an existing Slider
 */
export async function updateSlider(
    id: number,
    data: {
        image?: string;
        order?: number;
    }
) {
    try {
        const existing = await prisma.sliderImage.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Slider not found" };
        }

        let imageData = existing.image;

        if (data.image) {
            // Delete old image if it exists
            const existingImageData = existing.image as any;
            if (existingImageData?.public_id) {
                try {
                    await deleteFromCloudinary(existingImageData.public_id);
                } catch (cloudinaryError) {
                    console.error("Error deleting image from Cloudinary:", cloudinaryError);
                    // Continue anyway to upload new image
                }
            }

            // Upload new
            const uploadResult = await uploadToCloudinary(data.image);
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.sliderImage.update({
            where: { id },
            data: {
                image: imageData as any,
                order: data.order !== undefined ? data.order : undefined,
            },
        });

        updateTag("slider");
        updateTag(`slider-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating slider:", error);
        return { success: false, error: error.message || "Failed to update slider" };
    }
}

/**
 * Delete a Slider
 */
export async function deleteSlider(id: number) {
    try {
        const existing = await prisma.sliderImage.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Slider not found" };
        }

        // Delete image from Cloudinary
        const imageData = existing.image as any;
        if (imageData?.public_id) {
            try {
                await deleteFromCloudinary(imageData.public_id);
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
            }
        }

        await prisma.sliderImage.delete({
            where: { id },
        });

        updateTag("slider");
        updateTag(`slider-${id}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting slider:", error);
        return { success: false, error: error.message || "Failed to delete slider" };
    }
}
