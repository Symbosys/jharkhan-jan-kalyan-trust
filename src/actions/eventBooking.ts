"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { BookingStatus, Prisma } from "../../generated/prisma/client";

/**
 * Get all event bookings with pagination and filtering
 */
export async function getAllBookings(options?: {
    page?: number;
    limit?: number;
    eventId?: number;
    status?: BookingStatus;
    isTeamMember?: boolean;
    search?: string;
}) {
    "use cache";
    cacheTag("bookings");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EventBookingWhereInput = {};

    if (options?.eventId) where.eventId = options.eventId;
    if (options?.status) where.status = options.status;
    if (options?.isTeamMember !== undefined) where.isTeamMember = options.isTeamMember;

    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { mobile: { contains: options.search } },
            { email: { contains: options.search } },
            { city: { contains: options.search } },
            { memberShipNumber: { contains: options.search } },
        ];
    }

    try {
        const [bookings, total] = await Promise.all([
            prisma.eventBooking.findMany({
                where,
                skip,
                take: limit,
                include: {
                    event: {
                        select: { title: true, date: true }
                    },
                    memberShip: {
                        select: { name: true, memberShipNumber: true }
                    }
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.eventBooking.count({ where }),
        ]);

        return {
            bookings,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
        };
    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Event Booking
 */
export async function createBooking(data: {
    eventId: number;
    name: string;
    mobile: string;
    email: string;
    city: string;
    isTeamMember?: boolean;
    memberShipNumber?: string;
}) {
    try {
        // If team member, optionally verify membership number exists
        if (data.isTeamMember && data.memberShipNumber) {
            const member = await prisma.memberShip.findUnique({
                where: { memberShipNumber: data.memberShipNumber }
            });
            if (!member) {
                return { success: false, error: "Invalid membership number" };
            }
        }

        const booking = await prisma.eventBooking.create({
            data: {
                eventId: data.eventId,
                name: data.name,
                mobile: data.mobile,
                email: data.email,
                city: data.city,
                isTeamMember: data.isTeamMember || false,
                memberShipNumber: (data.isTeamMember && data.memberShipNumber) ? data.memberShipNumber : null,
                status: "PENDING",
            },
        });

        updateTag("bookings");
        updateTag(`event-bookings-${data.eventId}`);
        return { success: true, data: booking };
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update Booking Status
 */
export async function updateBookingStatus(id: number, status: BookingStatus) {
    try {
        const updated = await prisma.eventBooking.update({
            where: { id },
            data: { status }
        });

        updateTag("bookings");
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating booking status:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a Booking
 */
export async function deleteBooking(id: number) {
    try {
        await prisma.eventBooking.delete({ where: { id } });
        updateTag("bookings");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting booking:", error);
        return { success: false, error: error.message };
    }
}
