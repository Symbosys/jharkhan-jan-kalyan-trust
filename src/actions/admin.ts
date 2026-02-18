"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { Role, Prisma } from "../../generated/prisma/client";
import bcrypt from "bcryptjs";

/**
 * Get all admins (No pagination)
 */
export async function getAllAdmins() {
    "use cache";
    cacheTag("admins");
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return admins;
    } catch (error: any) {
        console.error("Error fetching admins:", error);
        throw new Error(error.message);
    }
}

/**
 * Create a new Admin
 */
export async function createAdmin(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
}) {
    try {
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: data.email },
        });

        if (existingAdmin) {
            return { success: false, error: "Admin with this email already exists" };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const admin = await prisma.admin.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        updateTag("admins");
        return { success: true, data: admin };
    } catch (error: any) {
        console.error("Error creating admin:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing Admin
 */
export async function updateAdmin(
    id: number,
    data: {
        name?: string;
        email?: string;
        password?: string;
        role?: Role;
    }
) {
    try {
        const updateData: any = { ...data };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const updated = await prisma.admin.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        updateTag("admins");
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating admin:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete an Admin
 */
export async function deleteAdmin(id: number) {
    try {
        await prisma.admin.delete({
            where: { id },
        });

        updateTag("admins");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting admin:", error);
        return { success: false, error: error.message };
    }
}
