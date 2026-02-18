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
    profilePicture: string; // base64/path
    documentsType: DocumentType;
    documents: string; // base64/path
    otherDocuments?: string; // base64/path
    paymentMode: PaymentMode;
    paymentImage: string; // base64/path for receipt
    planId: number;
}) {
    try {
        // 1. Generate Membership Number
        const memberShipNumber = await generateMembershipNumber();

        // 2. Upload Files to Cloudinary
        const [profileRes, docRes, payRes, otherRes] = await Promise.all([
            uploadToCloudinary(data.profilePicture, "memberships"),
            uploadToCloudinary(data.documents, "memberships"),
            uploadToCloudinary(data.paymentImage, "memberships"),
            data.otherDocuments ? uploadToCloudinary(data.otherDocuments, "memberships") : Promise.resolve(null)
        ]);

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
                profilePicture: { url: profileRes.url, public_id: profileRes.public_id },
                documentsType: data.documentsType,
                documents: { url: docRes.url, public_id: docRes.public_id },
                otherDocuments: otherRes ? { url: otherRes.url, public_id: otherRes.public_id } : {},
                paymentMode: data.paymentMode,
                payment: { url: payRes.url, public_id: payRes.public_id },
                planId: data.planId,
                status: "PENDING",
            },
        });

        updateTag("memberships");
        return { success: true, data: membership };
    } catch (error) {
        console.error("Error applying membership:", error);
        return { success: false, error: "Failed to apply for membership" };
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
        const existing = await prisma.memberShip.findUnique({ where: { id } });
        if (!existing) throw new Error("Membership not found");

        const updated = await prisma.memberShip.update({
            where: { id },
            data: { status },
            include: { plan: true }
        });

        updateTag("memberships");
        updateTag(`membership-${id}`);

        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating membership status:", error);
        return { success: false, error: error.message };
    }
}
