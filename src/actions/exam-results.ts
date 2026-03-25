"use server";

import { prisma } from "@/config/prisma";
import { revalidatePath, updateTag } from "next/cache";

/**
 * Upsert Exam Result for a School Enquiry
 */
export async function upsertExamResult(enquiryId: number, marks: number) {
    try {
        const result = await prisma.examResult.upsert({
            where: { enquiryId },
            update: { marks },
            create: {
                enquiryId,
                marks
            }
        });

        // Revalidate the school enquiries admin page and tags
        revalidatePath("/admin/school-enquiries");
        updateTag("school-enquiries");
        updateTag(`school-enquiry-${enquiryId}`);

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error upserting exam result:", error);
        return { success: false, error: error.message || "Failed to save exam result" };
    }
}
