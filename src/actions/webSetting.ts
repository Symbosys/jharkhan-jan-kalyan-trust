"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Get all Web Settings with optional search filtering
 */
export async function getAllWebSettings(options?: {
    search?: string;
}) {
    // @ts-ignore
    "use cache";
    cacheTag("websettings");

    const where: Prisma.WebSettingWhereInput = {};
    if (options?.search) {
        where.OR = [
            { key: { contains: options.search } },
            { value: { contains: options.search } },
        ];
    }

    try {
        const settings = await prisma.webSetting.findMany({
            where,
            orderBy: { key: "asc" },
        });

        return {
            settings,
            total: settings.length
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
    // @ts-ignore
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
    // @ts-ignore
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

        updateTag("websettings");
        updateTag(`websetting-${key}`);
        
        return { success: true, data: setting };
    } catch (error: any) {
        console.error("Error updating web setting:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Batch Update Web Settings
 */
export async function updateWebSettings(settings: Record<string, string>) {
    try {
        const operations = Object.entries(settings).map(([key, value]) => 
            prisma.webSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            })
        );

        await Promise.all(operations);

        updateTag("websettings");
        Object.keys(settings).forEach(key => updateTag(`websetting-${key}`));
        
        return { success: true };
    } catch (error: any) {
        console.error("Error batch updating web settings:", error);
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
