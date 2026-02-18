"use server";

import { prisma } from "@/config/prisma";
import { cacheTag, updateTag } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

/**
 * Submit a new Enquiry
 */
export async function createEnquiry(data: {
  name: string;
  mobile: string;
  email: string;
  topic: string;
  description: string;
}) {
  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        topic: data.topic,
        description: data.description,
      },
    });

    updateTag("enquiries");
    return { success: true, data: enquiry };
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all Enquiries with pagination and filtering
 */
export async function getAllEnquiries(options?: {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) {
  "use cache";
  cacheTag("enquiries");

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.EnquiryWhereInput = {};

  // Date Filtering
  if (options?.startDate || options?.endDate) {
    where.createdAt = {};
    if (options.startDate) where.createdAt.gte = new Date(options.startDate);
    if (options.endDate) where.createdAt.lte = new Date(options.endDate);
  }

  // Search Filtering
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { mobile: { contains: options.search } },
      { email: { contains: options.search } },
    ];
  }

  try {
    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return {
      enquiries,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (error: any) {
    console.error("Error fetching enquiries:", error);
    throw new Error(error.message);
  }
}

/**
 * Delete an Enquiry
 */
export async function deleteEnquiry(id: number) {
  try {
    await prisma.enquiry.delete({ where: { id } });
    updateTag("enquiries");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting enquiry:", error);
    return { success: false, error: error.message };
  }
}
