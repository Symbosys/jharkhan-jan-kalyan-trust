"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { BookingStatus, Prisma } from "../../generated/prisma/client";
import { sendEmail } from "@/config/email";
import { 
    eventBookingPendingEmailTemplate, 
    eventBookingConfirmedEmailTemplate, 
    eventBookingCancelledEmailTemplate 
} from "@/constants/event-booking-email";

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

        const event = await prisma.event.findUnique({
            where: { id: data.eventId },
            select: { title: true }
        });
        const eventName = event?.title || "Event";

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

        if (data.email) {
            await sendEmail({
                to: data.email,
                subject: `Booking Request Received for ${eventName} | Jharkhand Jan Kalyan Trust`,
                html: eventBookingPendingEmailTemplate(data.name, eventName)
            });
        }

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
            data: { status },
            include: { event: { select: { title: true } } }
        });

        if (updated.email) {
            if (status === "CONFIRMED") {
                await sendEmail({
                    to: updated.email,
                    subject: `Booking Confirmed for ${updated.event.title} | Jharkhand Jan Kalyan Trust`,
                    html: eventBookingConfirmedEmailTemplate(updated.name, updated.event.title)
                });
            } else if (status === "CANCELLED") {
                await sendEmail({
                    to: updated.email,
                    subject: `Booking Cancelled for ${updated.event.title} | Jharkhand Jan Kalyan Trust`,
                    html: eventBookingCancelledEmailTemplate(updated.name, updated.event.title)
                });
            }
        }

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
