"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Get events with pagination and filtering
 */
export async function getAllEvents(options?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    type?: string;
    search?: string;
}) {
    "use cache";
    cacheTag("events");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    // Filter by event date range
    if (options?.startDate || options?.endDate) {
        where.createdAt = {};
        if (options.startDate) where.createdAt.gte = new Date(options.startDate);
        if (options.endDate) where.createdAt.lte = new Date(options.endDate);
    }

    if (options?.type) where.type = options.type;

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search } },
            { description: { contains: options.search } },
            { location: { contains: options.search } },
        ];
    }

    try {
        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: "asc" },
            }),
            prisma.event.count({ where }),
        ]);

        return {
            events,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
        };
    } catch (error: any) {
        console.error("Error fetching events:", error);
        throw new Error(error.message);
    }
}

/**
 * Get Event by ID
 */
export async function getEventById(id: number) {
    "use cache";
    cacheTag(`event-${id}`, "events");
    try {
        return await prisma.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { eventBookings: true }
                }
            }
        });
    } catch (error: any) {
        console.error("Error fetching event:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Event
 */
export async function createEvent(data: {
    title: string;
    description: string;
    type: string;
    location: string;
    image?: string; // base64/path
    videoUrl?: string;
    date: Date;
}) {
    try {
        let imageData = {};

        if (data.image) {
            const uploadResult = await uploadToCloudinary(data.image, "events");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const event = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                location: data.location,
                image: imageData,
                videoUrl: data.videoUrl,
                date: data.date,
            },
        });

        updateTag("events");
        return { success: true, data: event };
    } catch (error: any) {
        console.error("Error creating event:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an Event
 */
export async function updateEvent(
    id: number,
    data: {
        title?: string;
        description?: string;
        type?: string;
        location?: string;
        image?: string;
        videoUrl?: string;
        date?: Date;
    }
) {
    try {
        const existing = await prisma.event.findUnique({ where: { id } });
        if (!existing) throw new Error("Event not found");

        let imageData = existing.image || {};

        if (data.image) {
            const existingImageData = existing.image as any;
            if (existingImageData?.public_id) {
                await deleteFromCloudinary(existingImageData.public_id);
            }

            const uploadResult = await uploadToCloudinary(data.image);
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.event.update({
            where: { id },
            data: {
                ...data,
                image: imageData,
            },
        });

        updateTag("events");
        updateTag(`event-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating event:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete an Event
 */
export async function deleteEvent(id: number) {
    try {
        const existing = await prisma.event.findUnique({ where: { id } });
        if (!existing) throw new Error("Event not found");

        const imageData = existing.image as any;
        if (imageData?.public_id) {
            await deleteFromCloudinary(imageData.public_id);
        }

        await prisma.event.delete({ where: { id } });

        updateTag("events");
        updateTag(`event-${id}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return { success: false, error: error.message };
    }
}
