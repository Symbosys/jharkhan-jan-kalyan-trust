"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { DonarStatus, PaymentMode, Prisma } from "../../generated/prisma/client";
import { sendEmail } from "@/config/email";
import { donationPendingEmailTemplate, donationVerifiedEmailTemplate } from "@/constants/donation-email";

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
    paymentMode: PaymentMode;
    // Client-side uploaded image data
    donorImageData?: { url: string; public_id: string };
    paymentData: { url: string; public_id: string };
}) {
    const uploadedPublicIds: string[] = [];
    if (data.donorImageData?.public_id) uploadedPublicIds.push(data.donorImageData.public_id);
    if (data.paymentData.public_id) uploadedPublicIds.push(data.paymentData.public_id);

    try {
        // 1. Create record
        const donar = await prisma.donar.create({
            data: {
                name: data.name,
                mobile: data.mobile,
                email: data.email,
                panNumber: data.panNumber,
                address: data.address,
                amount: data.amount,
                donorImage: data.donorImageData || {},
                paymentMode: data.paymentMode,
                payment: data.paymentData,
                status: "PENDING",
            },
        });

        // 2. Send Email
        if (data.email) {
            try {
                await sendEmail({
                    to: data.email,
                    subject: "Donation Received - Pending Verification | Jharkhand Jan Kalyan Trust",
                    html: donationPendingEmailTemplate(data.name, data.amount)
                });
            } catch (emailError) {
                // We don't fail the donation if only the email fails
                console.error("Error sending donation email:", emailError);
            }
        }

        updateTag("donars");
        return { success: true, data: donar };
    } catch (error: any) {
        console.error("Error creating donor:", error);

        // CLEANUP: If anything goes wrong, delete the pre-uploaded images from Cloudinary
        if (uploadedPublicIds.length > 0) {
            console.log("Cleaning up uploaded images due to server failure...");
            await Promise.allSettled(
                uploadedPublicIds.map(pid => deleteFromCloudinary(pid))
            );
        }

        return { success: false, error: error.message || "Failed to create donor record" };
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

        if (status === "VERIFIED" && updated.email) {
            await sendEmail({
                to: updated.email,
                subject: "Donation Verified Successfully | Jharkhand Jan Kalyan Trust",
                html: donationVerifiedEmailTemplate(updated.name, updated.amount)
            });
        }

        updateTag("donars");
        updateTag(`donar-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating donor status:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update general Donar details
 */
export async function updateDonar(
    id: number,
    data: {
        name?: string;
        mobile?: string;
        email?: string;
        panNumber?: string;
        address?: string;
        amount?: number;
        donorImage?: string; // base64
        paymentMode?: PaymentMode;
        payment?: string; // base64
    }
) {
    try {
        const existing = await prisma.donar.findUnique({ where: { id } });
        if (!existing) throw new Error("Donor not found");

        const updateData: any = { ...data };

        // Handle Image Updates
        if (data.donorImage && data.donorImage.startsWith('data:')) {
            const existingImage = existing.donorImage as any;
            if (existingImage?.public_id) {
                await deleteFromCloudinary(existingImage.public_id);
            }
            const uploadRes = await uploadToCloudinary(data.donorImage, "donars");
            updateData.donorImage = { url: uploadRes.url, public_id: uploadRes.public_id };
        } else {
            delete updateData.donorImage;
        }

        if (data.payment && data.payment.startsWith('data:')) {
            const existingPayment = existing.payment as any;
            if (existingPayment?.public_id) {
                await deleteFromCloudinary(existingPayment.public_id);
            }
            const uploadRes = await uploadToCloudinary(data.payment, "donars");
            updateData.payment = { url: uploadRes.url, public_id: uploadRes.public_id };
        } else {
            delete updateData.payment;
        }

        const updated = await prisma.donar.update({
            where: { id },
            data: updateData
        });

        updateTag("donars");
        updateTag(`donar-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating donor:", error);
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
