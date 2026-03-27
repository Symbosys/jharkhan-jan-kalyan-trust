"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cache } from "react";
import { cacheTag, updateTag } from "next/cache";

export type AffiliationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface CreateAffiliationInput {
    organizationName: string;
    registrationNumber?: string;
    establishedYear: number;
    organizationType: string;
    address: string;
    city: string;
    mobile: string;
    email: string;
    website?: string;
    directorName: string;
    directorMobile: string;
    directorEmail?: string;
    documents?: any;
    documentsBase64?: string;
}

interface UpdateAffiliationInput {
    organizationName?: string;
    registrationNumber?: string;
    establishedYear?: number;
    organizationType?: string;
    address?: string;
    city?: string;
    mobile?: string;
    email?: string;
    website?: string;
    directorName?: string;
    directorMobile?: string;
    directorEmail?: string;
    documents?: any;
    status?: AffiliationStatus;
    validFrom?: Date;
    validTill?: Date;
}

// Create a new affiliation request
export async function createAffiliation(data: CreateAffiliationInput) {
    try {
        let documentsData = data.documents;

        if (data.documentsBase64) {
            const uploadRes = await uploadToCloudinary(data.documentsBase64, "affiliations");
            documentsData = { url: uploadRes.url, public_id: uploadRes.public_id };
        }

        // Generate unique affiliation number
        let affiliationNumber = "";
        let isUnique = false;
        let attempts = 0;
        let counter = await prisma.affiliation.count() + 1;

        while (!isUnique && attempts < 100) {
            affiliationNumber = `AFF-${String(counter).padStart(4, '0')}-${new Date().getFullYear()}`;
            const existing = await prisma.affiliation.findUnique({
                where: { AffiliationNumber: affiliationNumber }
            });
            
            if (!existing) {
                isUnique = true;
            } else {
                counter++;
                attempts++;
            }
        }

        if (!isUnique) {
            throw new Error("Unable to generate unique affiliation number. Please try again.");
        }
        
        const affiliation = await prisma.affiliation.create({
            data: {
                AffiliationNumber: affiliationNumber,
                organizationName: data.organizationName,
                registrationNumber: data.registrationNumber,
                establishedYear: data.establishedYear,
                organizationType: data.organizationType,
                address: data.address,
                city: data.city,
                mobile: data.mobile,
                email: data.email,
                website: data.website,
                directorName: data.directorName,
                directorMobile: data.directorMobile,
                directorEmail: data.directorEmail,
                documents: documentsData,
            }
        });

        await updateTag("affiliations");

        return {
            success: true,
            data: affiliation
        };
    } catch (error: any) {
        console.error("Create affiliation error:", error);
        return {
            success: false,
            error: error.message || "Failed to create affiliation request"
        };
    }
}

// Get all affiliations with optional filters
export const getAllAffiliations = cache(async (filters?: {
    search?: string;
    status?: AffiliationStatus;
    limit?: number;
    offset?: number;
}) => {
    try {
        const where: any = {};

        // Apply filters
        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.search) {
            where.OR = [
                { organizationName: { contains: filters.search, mode: 'insensitive' } },
                { city: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { directorName: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        const [affiliations, totalCount] = await Promise.all([
            prisma.affiliation.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: filters?.limit || 50,
                skip: filters?.offset || 0
            }),
            prisma.affiliation.count({ where })
        ]);

        return {
            success: true,
            data: {
                affiliations,
                totalCount,
                hasNextPage: (filters?.offset || 0) + (filters?.limit || 50) < totalCount
            }
        };
    } catch (error: any) {
        console.error("Get all affiliations error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch affiliations"
        };
    }
});

// Get affiliation by ID
export const getAffiliationById = cache(async (id: number) => {
    try {
        const affiliation = await prisma.affiliation.findUnique({
            where: { id }
        });

        if (!affiliation) {
            return {
                success: false,
                error: "Affiliation not found"
            };
        }

        return {
            success: true,
            data: affiliation
        };
    } catch (error: any) {
        console.error("Get affiliation by ID error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch affiliation"
        };
    }
});

// Get affiliation by AffiliationNumber
export const getAffiliationByNumber = cache(async (affiliationNumber: string) => {
    try {
        const affiliation = await prisma.affiliation.findUnique({
            where: { AffiliationNumber: affiliationNumber }
        });

        if (!affiliation) {
            return {
                success: false,
                error: "Affiliation not found"
            };
        }

        return {
            success: true,
            data: affiliation
        };
    } catch (error: any) {
        console.error("Get affiliation by number error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch affiliation"
        };
    }
});

// Update affiliation
export async function updateAffiliation(id: number, data: UpdateAffiliationInput) {
    try {
        const affiliation = await prisma.affiliation.update({
            where: { id },
            data: {
                organizationName: data.organizationName,
                registrationNumber: data.registrationNumber,
                establishedYear: data.establishedYear,
                organizationType: data.organizationType,
                address: data.address,
                city: data.city,
                mobile: data.mobile,
                email: data.email,
                website: data.website,
                directorName: data.directorName,
                directorMobile: data.directorMobile,
                directorEmail: data.directorEmail,
                documents: data.documents,
                status: data.status,
                validFrom: data.validFrom,
                validTill: data.validTill
            }
        });

        await updateTag("affiliations");

        return {
            success: true,
            data: affiliation
        };
    } catch (error: any) {
        console.error("Update affiliation error:", error);
        return {
            success: false,
            error: error.message || "Failed to update affiliation"
        };
    }
}

// Update affiliation status (approve/reject)
export async function updateAffiliationStatus(id: number, status: AffiliationStatus) {
    try {
        const updateData: any = { status };
        
        // If approving, set validity period (1 year from today)
        if (status === 'APPROVED') {
            const today = new Date();
            const validTill = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            updateData.validFrom = today;
            updateData.validTill = validTill;
        }
        
        const affiliation = await prisma.affiliation.update({
            where: { id },
            data: updateData
        });

        await updateTag("affiliations");

        return {
            success: true,
            data: affiliation
        };
    } catch (error: any) {
        console.error("Update affiliation status error:", error);
        return {
            success: false,
            error: error.message || "Failed to update affiliation status"
        };
    }
}

// Update validity period only
export async function updateAffiliationValidity(id: number, validFrom: Date, validTill: Date) {
    try {
        const affiliation = await prisma.affiliation.update({
            where: { id },
            data: {
                validFrom,
                validTill
            }
        });

        await updateTag("affiliations");

        return {
            success: true,
            data: affiliation
        };
    } catch (error: any) {
        console.error("Update affiliation validity error:", error);
        return {
            success: false,
            error: error.message || "Failed to update affiliation validity period"
        };
    }
}

// Delete affiliation
export async function deleteAffiliation(id: number) {
    try {
        await prisma.affiliation.delete({
            where: { id }
        });

        await updateTag("affiliations");

        return {
            success: true,
            message: "Affiliation deleted successfully"
        };
    } catch (error: any) {
        console.error("Delete affiliation error:", error);
        return {
            success: false,
            error: error.message || "Failed to delete affiliation"
        };
    }
}