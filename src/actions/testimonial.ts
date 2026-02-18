"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Get testimonials with pagination and search
 */
export async function getAllTestimonials(options?: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    "use cache";
    cacheTag("testimonial");
    
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TestimonialWhereInput = {};
    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { position: { contains: options.search } },
            { message: { contains: options.search } },
        ];
    }

    try {
        const [testimonials, total] = await Promise.all([
            prisma.testimonial.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.testimonial.count({ where }),
        ]);

        return {
            testimonials,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching testimonials:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Testimonial
 */
export async function createTestimonial(data: {
    name: string;
    position: string;
    message: string;
    image?: string;
}) {
    try {
        let imageData = {};

        if (data.image) {
            const uploadResult = await uploadToCloudinary(data.image, "testimonials");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                name: data.name,
                position: data.position,
                message: data.message,
                image: imageData,
            },
        });

        updateTag("testimonial");
        return { success: true, data: testimonial };
    } catch (error: any) {
        console.error("Error creating testimonial:", error);
        return { success: false, error: error.message || "Failed to create testimonial" };
    }
}

/**
 * Update an existing Testimonial
 */
export async function updateTestimonial(
    id: number,
    data: {
        name?: string;
        position?: string;
        message?: string;
        image?: string;
    }
) {
    try {
        const existing = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Testimonial not found" };
        }

        let imageData = existing.image || {};

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
            const uploadResult = await uploadToCloudinary(data.image, "testimonials");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.testimonial.update({
            where: { id },
            data: {
                name: data.name,
                position: data.position,
                message: data.message,
                image: imageData,
            },
        });

        updateTag("testimonial");
        updateTag(`testimonial-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating testimonial:", error);
        return { success: false, error: error.message || "Failed to update testimonial" };
    }
}

/**
 * Delete a Testimonial
 */
export async function deleteTestimonial(id: number) {
    try {
        const existing = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Testimonial not found" };
        }

        const imageData = existing.image as any;
        if (imageData?.public_id) {
            try {
                await deleteFromCloudinary(imageData.public_id);
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
            }
        }

        await prisma.testimonial.delete({
            where: { id },
        });

        updateTag("testimonial");
        updateTag(`testimonial-${id}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting testimonial:", error);
        return { success: false, error: error.message || "Failed to delete testimonial" };
    }
}
