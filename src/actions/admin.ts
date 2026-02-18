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
        return { success: false, error: error.message || "Failed to create admin" };
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
        const existing = await prisma.admin.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Admin not found" };
        }

        // Prepare update data
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;
        
        if (data.password && data.password.trim() !== "") {
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
        return { success: false, error: error.message || "Failed to update admin" };
    }
}

/**
 * Delete an Admin
 */
export async function deleteAdmin(id: number) {
    try {
        const existing = await prisma.admin.findUnique({
            where: { id },
        });

        if (!existing) {
            return { success: false, error: "Admin not found" };
        }

        // Count admins to prevent deleting the last one? 
        // Maybe too much for now, but good practice.
        const adminCount = await prisma.admin.count();
        if (adminCount <= 1) {
            return { success: false, error: "Cannot delete the last admin account" };
        }

        await prisma.admin.delete({
            where: { id },
        });

        updateTag("admins");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting admin:", error);
        return { success: false, error: error.message || "Failed to delete admin" };
    }
}
