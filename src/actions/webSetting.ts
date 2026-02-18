"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Get all Web Settings with pagination and search
 */
export async function getAllWebSettings(options?: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    "use cache";
    cacheTag("websettings");
    
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.WebSettingWhereInput = {};
    if (options?.search) {
        where.OR = [
            { key: { contains: options.search } },
            { value: { contains: options.search } },
        ];
    }

    try {
        const [settings, total] = await Promise.all([
            prisma.webSetting.findMany({
                where,
                skip,
                take: limit,
                orderBy: { key: "asc" },
            }),
            prisma.webSetting.count({ where }),
        ]);

        return {
            settings,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching web settings:", error);
        throw new Error(error.message);
    }
}

/**
 * Get all Web Settings as a key-value object
 */
export async function getWebSettings() {
    "use cache";
    cacheTag("websettings");
    try {
        const settings = await prisma.webSetting.findMany();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error: any) {
        console.error("Error fetching web settings map:", error);
        throw new Error(error.message);
    }
}

/**
 * Get a specific Web Setting by key
 */
export async function getWebSettingByKey(key: string) {
    "use cache";
    cacheTag(`websetting-${key}`, "websettings");
    try {
        const setting = await prisma.webSetting.findUnique({
            where: { key },
        });
        return setting?.value || null;
    } catch (error: any) {
        console.error(`Error fetching web setting ${key}:`, error);
        throw new Error(error.message);
    }
}

/**
 * Update or Create a Web Setting
 */
export async function updateWebSetting(key: string, value: string) {
    try {
        const setting = await prisma.webSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });

        // Update tags
        updateTag("websettings");
        updateTag(`websetting-${key}`);
        
        return { success: true, data: setting };
    } catch (error: any) {
        console.error("Error updating web setting:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a Web Setting
 */
export async function deleteWebSetting(key: string) {
    try {
        await prisma.webSetting.delete({
            where: { key },
        });

        updateTag("websettings");
        updateTag(`websetting-${key}`);
        
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting web setting:", error);
        return { success: false, error: error.message };
    }
}
