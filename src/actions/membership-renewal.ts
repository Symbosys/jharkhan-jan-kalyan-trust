"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { 
    RenewalStatus, 
    PaymentMode, 
    Prisma,
    PlanDurationType
} from "../../generated/prisma/client";
import { calculateExpirationDate } from "@/lib/membership-utils";

/**
 * Submit a Membership Renewal Request
 */
export async function submitRenewalRequest(data: {
    membershipId: number;
    planId: number;
    paymentMode: PaymentMode;
    paymentProof: string; // base64 or file path
}) {
    try {
        // 1. Upload payment proof to Cloudinary
        const uploadRes = await uploadToCloudinary(data.paymentProof, "renewals");

        // 2. Create renewal record
        const renewal = await prisma.membershipRenewal.create({
            data: {
                membershipId: data.membershipId,
                planId: data.planId,
                paymentMode: data.paymentMode,
                paymentProof: { url: uploadRes.url, public_id: uploadRes.public_id },
                status: "PENDING"
            }
        });

        updateTag("membership-renewals");
        return { success: true, data: renewal };
    } catch (error: any) {
        console.error("Error submitting renewal request:", error);
        return { success: false, error: error.message || "Failed to submit renewal request" };
    }
}

/**
 * Get all renewal requests with pagination and search
 */
export async function getAllRenewals(options?: {
    page?: number;
    limit?: number;
    status?: RenewalStatus;
    search?: string;
}) {
    "use cache";
    cacheTag("membership-renewals");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MembershipRenewalWhereInput = {};
    if (options?.status) where.status = options.status;

    if (options?.search) {
        where.membership = {
            OR: [
                { name: { contains: options.search } },
                { mobile: { contains: options.search } },
                { memberShipNumber: { contains: options.search } }
            ]
        };
    }

    try {
        const [renewals, total] = await Promise.all([
            prisma.membershipRenewal.findMany({
                where,
                skip,
                take: limit,
                include: {
                    membership: true,
                    plan: true
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.membershipRenewal.count({ where })
        ]);

        return {
            renewals,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching renewals:", error);
        throw new Error(error.message || "Failed to fetch renewals");
    }
}


/**
 * Verify (Approve/Reject) a renewal request
 */
export async function verifyRenewal(renewalId: number, status: RenewalStatus, adminComment?: string) {
    try {
        const renewal = await prisma.membershipRenewal.findUnique({
            where: { id: renewalId },
            include: { 
                membership: true,
                plan: true
            }
        });

        if (!renewal) throw new Error("Renewal request not found");

        if (status === "APPROVED") {
            // Calculate new expiration date
            // If the membership is already active, we might want to extend from current expiresAt
            // If it's expired, we extend from today.
            const baseDate = (renewal.membership.expiresAt && renewal.membership.expiresAt > new Date()) 
                ? renewal.membership.expiresAt 
                : new Date();
            
            const newExpiresAt = calculateExpirationDate(renewal.plan.duration, renewal.plan.durationType, baseDate);

            await prisma.$transaction([
                // Update membership
                prisma.memberShip.update({
                    where: { id: renewal.membershipId },
                    data: {
                        planId: renewal.planId,
                        status: "ACTIVE",
                        expiresAt: newExpiresAt,
                        payment: renewal.paymentProof as any // Update payment info to latest receipt
                    }
                }),
                // Update renewal status
                prisma.membershipRenewal.update({
                    where: { id: renewalId },
                    data: {
                        status: "APPROVED",
                        adminComment
                    }
                })
            ]);
        } else {
            // Just update renewal status to REJECTED
            await prisma.membershipRenewal.update({
                where: { id: renewalId },
                data: {
                    status: "REJECTED",
                    adminComment
                }
            });
        }

        updateTag("membership-renewals");
        updateTag("memberships");
        updateTag(`membership-${renewal.membershipId}`);

        return { success: true };
    } catch (error: any) {
        console.error("Error verifying renewal:", error);
        return { success: false, error: error.message || "Failed to verify renewal" };
    }
}
