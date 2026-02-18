"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Get news posts with pagination and search
 */
export async function getAllNews(options?: {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
}) {
    "use cache";
    cacheTag("news");
    
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsWhereInput = {};
    
    if (options?.startDate || options?.endDate) {
        where.createdAt = {}
        if(options?.startDate) {
            where.createdAt.gte = options.startDate;
        }
        if(options?.endDate) {
            where.createdAt.lte = options.endDate;
        }
    }

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search } },
            { description: { contains: options.search } },
        ];
    }

    try {
        const [news, total] = await Promise.all([
            prisma.news.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.news.count({ where }),
        ]);

        return {
            news,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching news:", error);
        throw new Error(error.message || "Failed to fetch news posts");
    }
}

/**
 * Create a new News post
 */
export async function createNews(data: {
    title: string;
    description: string;
    image?: string;
    videoUrl?: string;
}) {
    try {
        let imageData = {};

        if (data.image) {
            const uploadResult = await uploadToCloudinary(data.image, "news");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const news = await prisma.news.create({
            data: {
                title: data.title,
                description: data.description,
                image: imageData,
                videoUrl: data.videoUrl,
            },
        });

        updateTag("news");
        return { success: true, data: news };
    } catch (error: any) {
        console.error("Error creating news post:", error);
        return { success: false, error: error.message || "Failed to create news post" };
    }
}

/**
 * Update an existing News post
 */
export async function updateNews(
    id: number,
    data: {
        title?: string;
        description?: string;
        image?: string;
        videoUrl?: string;
    }
) {
    try {
        const existing = await prisma.news.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "News post not found" };
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
            const uploadResult = await uploadToCloudinary(data.image, "news");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.news.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                image: imageData,
                videoUrl: data.videoUrl,
            },
        });

        updateTag("news");
        updateTag(`news-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating news post:", error);
        return { success: false, error: error.message || "Failed to update news post" };
    }
}

/**
 * Delete a News post
 */
export async function deleteNews(id: number) {
    try {
        const existing = await prisma.news.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "News post not found" };
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

        await prisma.news.delete({
            where: { id },
        });

        updateTag("news");
        updateTag(`news-${id}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting news post:", error);
        return { success: false, error: error.message || "Failed to delete news post" };
    }
}
