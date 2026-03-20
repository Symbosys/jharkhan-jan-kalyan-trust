"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { 
    MemberShipStatus, 
    PaymentMode, 
    Gender, 
    GurdianType, 
    DocumentType, 
    Prisma
} from "../../generated/prisma/client";
import { calculateExpirationDate } from "@/lib/membership-utils";
import { sendEmail } from "@/config/email";
import { 
    membershipPendingEmailTemplate, 
    membershipApprovedEmailTemplate 
} from "@/constants/membership-email";

/**
 * Utility to generate a unique Membership Number
 * Format: JK-YYYYMMDD-XXXX (NGO Initials - Date - Random)
 */
async function generateMembershipNumber(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let isUnique = false;
    let membershipNumber = "";

    while (!isUnique) {
        const random = Math.floor(1000 + Math.random() * 9000);
        membershipNumber = `JK-${date}-${random}`;
        const existing = await prisma.memberShip.findUnique({
            where: { memberShipNumber: membershipNumber }
        });
        if (!existing) isUnique = true;
    }
    return membershipNumber;
}

/**
 * Apply for Membership
 */
export async function applyMembership(data: {
    name: string;
    gender: Gender;
    dob: Date;
    gurdianType: GurdianType;
    gurdianName: string;
    profession: string;
    bloodGroup: string;
    state: string;
    district: string;
    mobile: string;
    aadhaar: string;
    address: string;
    pinCode: string;
    email: string;
    profilePictureBase64?: string;
    documentsType?: DocumentType;
    paymentMode: PaymentMode;
    paymentImageBase64: string;
    planId: number;
}) {
    let uploadedPublicIds: string[] = [];

    try {
        // 1. Upload images on the server side First
        let profilePictureData;
        if (data.profilePictureBase64) {
            profilePictureData = await uploadToCloudinary(data.profilePictureBase64, "memberships");
            uploadedPublicIds.push(profilePictureData.public_id);
        } else {
            profilePictureData = {
                url: "https://media.istockphoto.com/id/178851574/vector/male-and-female-profile-picture.jpg?s=612x612&w=0&k=20&c=UyiKWUvzojP2EWM5l1ItQ4WKx-8ycF6joBBgqr7CRKc=",
                public_id: `default_profile_${Math.random().toString(36).substring(2, 10)}`
            };
        }

        const paymentImageData = await uploadToCloudinary(data.paymentImageBase64, "memberships");
        uploadedPublicIds.push(paymentImageData.public_id);

        // 2. Generate Membership Number
        const memberShipNumber = await generateMembershipNumber();

        // 3. Create Record
        const membership = await prisma.memberShip.create({
            data: {
                name: data.name,
                gender: data.gender,
                dob: data.dob,
                gurdianType: data.gurdianType,
                gurdianName: data.gurdianName,
                profession: data.profession,
                bloodGroup: data.bloodGroup,
                state: data.state,
                district: data.district,
                mobile: data.mobile,
                aadhaar: data.aadhaar,
                address: data.address,
                pinCode: data.pinCode,
                email: data.email,
                memberShipNumber,
                profilePicture: profilePictureData,
                documentsType: data.documentsType || "AADHAAR",
                documents: {},
                otherDocuments: {},
                paymentMode: data.paymentMode,
                payment: paymentImageData,
                planId: data.planId,
                status: "PENDING",
            },
            include: { plan: true }
        });

        // 4. Send Email
        if (data.email) {
            try {
                await sendEmail({
                    to: data.email,
                    subject: "Membership Application Received | Jharkhand Jan Kalyan Trust",
                    html: membershipPendingEmailTemplate(data.name, membership.plan.name, memberShipNumber)
                });
            } catch (emailError) {
                // Don't fail the whole membership application if only the email fails
                console.error("Error sending membership application email:", emailError);
            }
        }

        updateTag("memberships");
        return { success: true, data: membership };
    } catch (error: any) {
        console.error("Error applying membership:", error);

        // CLEANUP: Delete pre-uploaded images from Cloudinary if DB record creation fails
        if (uploadedPublicIds.length > 0) {
            console.log("Cleaning up membership images due to server failure...");
            await Promise.allSettled(
                uploadedPublicIds.map(pid => deleteFromCloudinary(pid))
            );
        }

        return { success: false, error: error.message || "Failed to apply for membership" };
    }
}

/**
 * Get Memberships with Pagination and Advanced Filtering
 */
export async function getAllMemberships(options?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    planId?: number;
    paymentMode?: PaymentMode;
    status?: MemberShipStatus;
    search?: string;
}) {
    "use cache";
    cacheTag("memberships");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MemberShipWhereInput = {};

    // Date Filtering
    if (options?.startDate || options?.endDate) {
        where.createdAt = {
            ...(options.startDate && { gte: options.startDate }),
            ...(options.endDate && { lte: options.endDate }),
        };
    }

    // Exact Match Filters
    if (options?.planId) where.planId = options.planId;
    if (options?.paymentMode) where.paymentMode = options.paymentMode;
    if (options?.status) where.status = options.status;

    // Multi-field Search
    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { mobile: { contains: options.search } },
            { aadhaar: { contains: options.search } },
            { email: { contains: options.search } },
            { memberShipNumber: { contains: options.search } },
        ];
    }

    try {
        const [memberships, total] = await Promise.all([
            prisma.memberShip.findMany({
                where,
                skip,
                take: limit,
                include: { plan: true },
                orderBy: { createdAt: "desc" },
            }),
            prisma.memberShip.count({ where }),
        ]);

        return {
            memberships,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching memberships:", error);
        throw new Error(error.message);
    }
}

/**
 * Get Membership by Number
 */
export async function getMembershipByNumber(memberShipNumber: string) {
    "use cache";
    cacheTag(`membership-${memberShipNumber}`, "memberships");
    try {
        return await prisma.memberShip.findUnique({
            where: { memberShipNumber },
            include: { plan: true }
        });
    } catch (error: any) {
        console.error("Error fetching membership:", error);
        throw new Error(error.message);
    }
}

/**
 * Get Membership by ID
 */
export async function getMembershipById(id: number) {
    "use cache";
    cacheTag(`membership-${id}`, "memberships");
    try {
        return await prisma.memberShip.findUnique({
            where: { id },
            include: { plan: true }
        });
    } catch (error: any) {
        console.error("Error fetching membership:", error);
        throw new Error(error.message);
    }
}

/**
 * Delete Membership with Cloudinary Cleanup
 */
export async function deleteMembership(id: number) {
    try {
        const existing = await prisma.memberShip.findUnique({ where: { id } });
        if (!existing) throw new Error("Membership not found");

        // Clean up all related assets in Cloudinary
        const imagesToDelete = [
            (existing.profilePicture as any)?.public_id,
            (existing.documents as any)?.public_id,
            (existing.payment as any)?.public_id,
            (existing.otherDocuments as any)?.public_id,
        ].filter(Boolean);

        await Promise.all(imagesToDelete.map(id => deleteFromCloudinary(id)));

        await prisma.memberShip.delete({ where: { id } });

        updateTag("memberships");
        updateTag(`membership-${id}`);

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting membership:", error);
        return { success: false, error: error.message };
    }
}
/**
 * Update Membership Status (Verify/Reject/etc.)
 */
export async function updateMembershipStatus(id: number, status: MemberShipStatus) {
    try {
        const existing = await prisma.memberShip.findUnique({ 
            where: { id },
            include: { plan: true }
        });
        if (!existing) throw new Error("Membership not found");

        const data: Prisma.MemberShipUpdateInput = { status };

        // If activating a membership that doesn't have an expiration date yet
        if (status === "ACTIVE" && !existing.expiresAt) {
            data.expiresAt = calculateExpirationDate(existing.plan.duration, existing.plan.durationType);
        }

        const updated = await prisma.memberShip.update({
            where: { id },
            data,
            include: { plan: true }
        });

        if (updated.email) {
            if (status === "ACTIVE") {
                await sendEmail({
                    to: updated.email,
                    subject: "Membership Approved! | Jharkhand Jan Kalyan Trust",
                    html: membershipApprovedEmailTemplate(
                        updated.name, 
                        updated.plan.name, 
                        updated.memberShipNumber, 
                        updated.expiresAt
                    )
                });
            }
        }

        updateTag("memberships");
        updateTag(`membership-${id}`);

        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating membership status:", error);
        return { success: false, error: error.message };
    }
}
