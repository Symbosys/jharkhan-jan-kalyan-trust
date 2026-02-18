"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { PlanDurationType, Prisma } from "../../generated/prisma/client";

/**
 * Get Membership Plans with pagination and search
 */
export async function getAllMembershipPlans(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}) {
    "use cache";
    cacheTag("membershipplans");
    
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MemberShipPlanWhereInput = {};
    if (options?.isActive !== undefined) where.isActive = options.isActive;
    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { description: { contains: options.search } },
        ];
    }

    try {
        const [plans, total] = await Promise.all([
            prisma.memberShipPlan.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    amount: "asc",
                },
            }),
            prisma.memberShipPlan.count({ where }),
        ]);

        return {
            plans,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching membership plans:", error);
        throw new Error(error.message);
    }
}

/**
 * Get a specific Membership Plan by ID
 */
export async function getMembershipPlanById(id: number) {
    "use cache";
    cacheTag(`membershipplan-${id}`, "membershipplans");
    try {
        const plan = await prisma.memberShipPlan.findUnique({
            where: { id },
        });
        return plan;
    } catch (error: any) {
        console.error(`Error fetching membership plan ${id}:`, error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Membership Plan
 */
export async function createMembershipPlan(data: {
    name: string;
    amount: number;
    duration: number;
    durationType: PlanDurationType;
    description: string;
    isActive?: boolean;
}) {
    try {
        const plan = await prisma.memberShipPlan.create({
            data: {
                name: data.name,
                amount: data.amount,
                duration: data.duration,
                durationType: data.durationType,
                description: data.description,
                isActive: data.isActive ?? true,
            },
        });

        updateTag("membershipplans");
        return { success: true, data: plan };
    } catch (error: any) {
        console.error("Error creating membership plan:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing Membership Plan
 */
export async function updateMembershipPlan(
    id: number,
    data: {
        name?: string;
        amount?: number;
        duration?: number;
        durationType?: PlanDurationType;
        description?: string;
        isActive?: boolean;
    }
) {
    try {
        const updated = await prisma.memberShipPlan.update({
            where: { id },
            data: {
                name: data.name,
                amount: data.amount,
                duration: data.duration,
                durationType: data.durationType,
                description: data.description,
                isActive: data.isActive,
            },
        });

        updateTag("membershipplans");
        updateTag(`membershipplan-${id}`);
        
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating membership plan:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a Membership Plan
 */
export async function deleteMembershipPlan(id: number) {
    try {
        await prisma.memberShipPlan.delete({
            where: { id },
        });

        updateTag("membershipplans");
        updateTag(`membershipplan-${id}`);
        
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting membership plan:", error);
        return { success: false, error: error.message };
    }
}
