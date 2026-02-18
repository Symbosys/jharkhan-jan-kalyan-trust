"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { DonarStatus, PaymentMode, Prisma } from "../../generated/prisma/client";

/**
 * Create a new Donor (Donar)
 */
export async function createDonar(data: {
    name: string;
    mobile: string;
    email: string;
    panNumber: string;
    address: string;
    amount: number;
    donorImage?: string; // base64/path
    paymentMode: PaymentMode;
    payment: string; // base64/path for proof
}) {
    try {
        // 1. Upload files to Cloudinary
        const [donorImageRes, paymentRes] = await Promise.all([
            data.donorImage ? uploadToCloudinary(data.donorImage, "donars") : Promise.resolve(null),
            uploadToCloudinary(data.payment, "donars")
        ]);

        // 2. Create record
        const donar = await prisma.donar.create({
            data: {
                name: data.name,
                mobile: data.mobile,
                email: data.email,
                panNumber: data.panNumber,
                address: data.address,
                amount: data.amount,
                donorImage: donorImageRes ? { url: donorImageRes.url, public_id: donorImageRes.public_id } : {},
                paymentMode: data.paymentMode,
                payment: { url: paymentRes.url, public_id: paymentRes.public_id },
                status: "PENDING",
            },
        });

        updateTag("donars");
        return { success: true, data: donar };
    } catch (error: any) {
        console.error("Error creating donor:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get Donors (Donars) with Pagination and Advanced Filtering
 */
export async function getAllDonars(options?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    status?: DonarStatus;
    search?: string;
}) {
    "use cache";
    cacheTag("donars");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DonarWhereInput = { AND: [] };

    // Date Filtering
    if (options?.startDate || options?.endDate) {
        where.createdAt = {};
        if (options.startDate) where.createdAt.gte = new Date(options.startDate);
        if (options.endDate) where.createdAt.lte = new Date(options.endDate);
    }

    // Status Filter
    if (options?.status) where.status = options.status;

    // Multi-field Search
    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { mobile: { contains: options.search } },
            { email: { contains: options.search } },
            { panNumber: { contains: options.search } },
        ];
    }

    try {
        const [donars, total] = await Promise.all([
            prisma.donar.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.donar.count({ where }),
        ]);

        return {
            donars,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching donors:", error);
        throw new Error(error.message);
    }
}

/**
 * Get Donor by ID
 */
export async function getDonarById(id: number) {
    "use cache";
    cacheTag(`donar-${id}`, "donars");
    try {
        return await prisma.donar.findUnique({
            where: { id },
        });
    } catch (error: any) {
        console.error("Error fetching donor:", error);
        throw new Error(error.message);
    }
}

/**
 * Update Donor Status (Verification)
 */
export async function updateDonarStatus(id: number, status: DonarStatus) {
    try {
        const updated = await prisma.donar.update({
            where: { id },
            data: { status }
        });

        updateTag("donars");
        updateTag(`donar-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating donor status:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete Donor with Cloudinary Cleanup
 */
export async function deleteDonar(id: number) {
    try {
        const existing = await prisma.donar.findUnique({ where: { id } });
        if (!existing) throw new Error("Donor not found");

        const imagesToDelete = [
            (existing.donorImage as any)?.public_id,
            (existing.payment as any)?.public_id,
        ].filter(Boolean);

        await Promise.all(imagesToDelete.map(pid => deleteFromCloudinary(pid)));

        await prisma.donar.delete({ where: { id } });

        updateTag("donars");
        updateTag(`donar-${id}`);

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting donor:", error);
        return { success: false, error: error.message };
    }
}
