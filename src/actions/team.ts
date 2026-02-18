"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { TeamType, Prisma } from "../../generated/prisma/client";

/**
 * Get team members with pagination and filtering
 */
export async function getAllTeam(options?: { 
    page?: number; 
    limit?: number; 
    type?: TeamType;
    search?: string;
}) {
    "use cache";
    cacheTag("team");
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const where: Prisma.TeamWhereInput = {};
    if (options?.type) where.type = options.type;
    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { position: { contains: options.search } },
            { location: { contains: options.search } },
        ];
    }

    try {
        const [team, total] = await Promise.all([
            prisma.team.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.team.count({ where }),
        ]);

        return {
            team,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching team members:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Team Member
 */
export async function createTeamMember(data: {
    name: string;
    position: string;
    location?: string;
    type: TeamType;
    image: string; // base64 or path
}) {
    try {
        // Upload image to Cloudinary (required for Team)
        const uploadResult = await uploadToCloudinary(data.image, "team");

        const member = await prisma.team.create({
            data: {
                name: data.name,
                position: data.position,
                location: data.location,
                type: data.type,
                image: {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                },
            },
        });

        updateTag("team");
        return { success: true, data: member };
    } catch (error: any) {
        console.error("Error creating team member:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing Team Member
 */
export async function updateTeamMember(
    id: number,
    data: {
        name?: string;
        position?: string;
        location?: string;
        type?: TeamType;
        image?: string;
    }
) {
    try {
        const existing = await prisma.team.findUnique({
            where: { id },
        });

        if (!existing) throw new Error("Team member not found");

        let imageData = existing.image;

        if (data.image) {
            // Delete old image from Cloudinary
            const existingImageData = existing.image as any;
            if (existingImageData?.public_id) {
                await deleteFromCloudinary(existingImageData.public_id);
            }

            // Upload new
            const uploadResult = await uploadToCloudinary(data.image);
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        const updated = await prisma.team.update({
            where: { id },
            data: {
                name: data.name,
                position: data.position,
                location: data.location,
                type: data.type,
                image: imageData as any,
            },
        });

        updateTag("team");
        updateTag(`team-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating team member:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a Team Member
 */
export async function deleteTeamMember(id: number) {
    try {
        const existing = await prisma.team.findUnique({
            where: { id },
        });

        if (!existing) throw new Error("Team member not found");

        // Delete image from Cloudinary
        const imageData = existing.image as any;
        if (imageData?.public_id) {
            await deleteFromCloudinary(imageData.public_id);
        }

        await prisma.team.delete({
            where: { id },
        });

        updateTag("team");
        updateTag(`team-${id}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting team member:", error);
        return { success: false, error: error.message };
    }
}
