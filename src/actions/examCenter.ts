"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Create a new Exam Center
 */
export async function createExamCenter(data: {
    name: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    mobile?: string;
    email?: string;
    website?: string;
    description?: string;
    capacity?: number;
}) {
    try {
        const examCenter = await prisma.examCenter.create({
            data: {
                name: data.name,
                address: data.address,
                city: data.city,
                state: data.state,
                pinCode: data.pinCode,
                mobile: data.mobile,
                email: data.email,
                website: data.website,
                description: data.description,
                capacity: data.capacity,
            },
        });

        updateTag("exam-centers");
        return { success: true, data: examCenter };
    } catch (error: any) {
        console.error("Error creating exam center:", error);
        return { success: false, error: error.message || "Failed to create exam center" };
    }
}

/**
 * Get all Exam Centers with optional search and pagination
 */
export async function getAllExamCenters(options?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
}) {
    "use cache";
    cacheTag("exam-centers");

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.ExamCenterWhereInput = {};

    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { address: { contains: options.search } },
            { city: { contains: options.search } },
            { state: { contains: options.search } },
        ];
    }

    if (options?.city) {
        where.city = options.city;
    }

    if (options?.state) {
        where.state = options.state;
    }

    try {
        const [examCenters, total] = await Promise.all([
            prisma.examCenter.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: "asc" },
                include: {
                    _count: {
                        select: { schoolEnquiries: true }
                    }
                }
            }),
            prisma.examCenter.count({ where }),
        ]);

        return {
            examCenters,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching exam centers:", error);
        throw new Error(error.message);
    }
}

/**
 * Get available exam centers (with less than 120 students registered)
 */
export async function getAvailableExamCenters() {
    "use cache";
    cacheTag("exam-centers", "available-exam-centers");

    try {
        const examCenters = await prisma.examCenter.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { schoolEnquiries: true }
                }
            }
        });

        // Filter centers with less than their capacity
        const availableCenters = examCenters.filter(
            center => center._count.schoolEnquiries < center.capacity
        );

        return {
            examCenters: availableCenters.map(center => ({
                ...center,
                availableSeats: center.capacity - center._count.schoolEnquiries
            }))
        };
    } catch (error: any) {
        console.error("Error fetching available exam centers:", error);
        throw new Error(error.message);
    }
}

/**
 * Get Exam Center by ID
 */
export async function getExamCenterById(id: number) {
    "use cache";
    cacheTag(`exam-center-${id}`, "exam-centers");

    try {
        const examCenter = await prisma.examCenter.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { schoolEnquiries: true }
                },
                schoolEnquiries: {
                    select: {
                        id: true,
                        name: true,
                        registrationNumber: true,
                        status: true,
                    },
                    orderBy: { createdAt: "desc" },
                }
            }
        });

        if (!examCenter) {
            return null;
        }

        return {
            ...examCenter,
            availableSeats: examCenter.capacity - examCenter._count.schoolEnquiries,
            isFull: examCenter._count.schoolEnquiries >= examCenter.capacity
        };
    } catch (error: any) {
        console.error("Error fetching exam center:", error);
        throw new Error(error.message);
    }
}

/**
 * Check if exam center has available seats
 */
export async function checkExamCenterAvailability(id: number) {
    "use cache";
    cacheTag(`exam-center-availability-${id}`, "exam-centers");
    try {
        const center = await prisma.examCenter.findUnique({
            where: { id },
            select: { capacity: true }
        });

        if (!center) throw new Error("Exam center not found");

        const count = await prisma.schoolEnquiry.count({
            where: { examCenterId: id }
        });

        return {
            totalSeats: center.capacity,
            occupiedSeats: count,
            availableSeats: center.capacity - count,
            isAvailable: count < center.capacity,
            isFull: count >= center.capacity
        };
    } catch (error: any) {
        console.error("Error checking exam center availability:", error);
        throw new Error(error.message);
    }
}

/**
 * Update Exam Center
 */
export async function updateExamCenter(
    id: number,
    data: {
        name?: string;
        address?: string;
        city?: string;
        state?: string;
        pinCode?: string;
        mobile?: string;
        email?: string;
        website?: string;
        description?: string;
        capacity?: number;
    }
) {
    try {
        const existing = await prisma.examCenter.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Exam center not found" };
        }

        const updated = await prisma.examCenter.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                city: data.city,
                state: data.state,
                pinCode: data.pinCode,
                mobile: data.mobile,
                email: data.email,
                website: data.website,
                description: data.description,
                capacity: data.capacity,
            },
        });

        updateTag("exam-centers");
        updateTag(`exam-center-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating exam center:", error);
        return { success: false, error: error.message || "Failed to update exam center" };
    }
}

/**
 * Delete Exam Center
 */
export async function deleteExamCenter(id: number) {
    try {
        const existing = await prisma.examCenter.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { schoolEnquiries: true }
                }
            }
        });

        if (!existing) {
            return { success: false, error: "Exam center not found" };
        }

        // Check if there are any students registered
        if (existing._count.schoolEnquiries > 0) {
            return { 
                success: false, 
                error: `Cannot delete exam center. ${existing._count.schoolEnquiries} student(s) are registered. Please reassign or delete them first.` 
            };
        }

        await prisma.examCenter.delete({ where: { id } });

        updateTag("exam-centers");
        updateTag(`exam-center-${id}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting exam center:", error);
        return { success: false, error: error.message || "Failed to delete exam center" };
    }
}

/**
 * Get all cities (for filtering)
 */
export async function getExamCenterCities() {
    "use cache";
    cacheTag("exam-centers");

    try {
        const cities = await prisma.examCenter.findMany({
            select: { city: true },
            distinct: ["city"],
            orderBy: { city: "asc" },
        });

        return cities.map(c => c.city);
    } catch (error: any) {
        console.error("Error fetching exam center cities:", error);
        throw new Error(error.message);
    }
}

/**
 * Get all states (for filtering)
 */
export async function getExamCenterStates() {
    "use cache";
    cacheTag("exam-centers");

    try {
        const states = await prisma.examCenter.findMany({
            select: { state: true },
            distinct: ["state"],
            orderBy: { state: "asc" },
        });

        return states.map(s => s.state);
    } catch (error: any) {
        console.error("Error fetching exam center states:", error);
        throw new Error(error.message);
    }
}
