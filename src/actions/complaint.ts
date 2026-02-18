"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Register a new Complaint
 */
export async function registerComplaint(data: {
    name: string;
    mobile: string;
    city: string;
    message: string;
    description: string;
    videoUrl: string;
    document1?: string; // base64/path
    document2?: string; // base64/path
}) {
    try {
        // 1. Upload documents to Cloudinary if provided
        const [doc1Res, doc2Res] = await Promise.all([
            data.document1 ? uploadToCloudinary(data.document1, "complaints") : Promise.resolve(null),
            data.document2 ? uploadToCloudinary(data.document2, "complaints") : Promise.resolve(null)
        ]);

        // 2. Create record
        const complaint = await prisma.registerComplaint.create({
            data: {
                name: data.name,
                mobile: data.mobile,
                city: data.city,
                message: data.message,
                description: data.description,
                videoUrl: data.videoUrl,
                document1: doc1Res ? { url: doc1Res.url, public_id: doc1Res.public_id } : {},
                document2: doc2Res ? { url: doc2Res.url, public_id: doc2Res.public_id } : {},
            },
        });

        // 3. Clear cache
        updateTag("complaints");
        return { success: true, data: complaint };
    } catch (error: any) {
        console.error("Error registering complaint:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all Complaints with pagination and filtering
 */
export async function getAllComplaints(options?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}) {
    "use cache";
    cacheTag("complaints");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.RegisterComplaintWhereInput = {};

    // Date Filtering
    if (options?.startDate || options?.endDate) {
        where.createdAt = {};
        if (options.startDate) where.createdAt.gte = new Date(options.startDate);
        if (options.endDate) where.createdAt.lte = new Date(options.endDate);
    }

    // Search Filtering
    if (options?.search) {
        where.OR = [
            {name: {contains: options.search}},
            {mobile: {contains: options.search}},
            {city: {contains: options.search}},
            {message: {contains: options.search}},
        ]
    }

    try {
        const [complaints, total] = await Promise.all([
            prisma.registerComplaint.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.registerComplaint.count({ where }),
        ]);

        return {
            complaints,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching complaints:", error);
        throw new Error(error.message);
    }
}

/**
 * Delete a Complaint with Cloudinary cleanup
 */
export async function deleteComplaint(id: number) {
    try {
        const existing = await prisma.registerComplaint.findUnique({ where: { id } });
        if (!existing) throw new Error("Complaint not found");

        // Cleanup files in Cloudinary
        const filesToDelete = [
            (existing.document1 as any)?.public_id,
            (existing.document2 as any)?.public_id,
        ].filter(Boolean);

        await Promise.all(filesToDelete.map(pid => deleteFromCloudinary(pid)));

        await prisma.registerComplaint.delete({ where: { id } });

        updateTag("complaints");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting complaint:", error);
        return { success: false, error: error.message };
    }
}
