"use server";

import { prisma } from "@/config/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { ResultStatus } from "../../generated/prisma/client";

/**
 * Upsert Exam Result for a School Enquiry
 */
export async function upsertExamResult(
    enquiryId: number,
    marks: number,
    correctAnswers?: number | null,
    wrongAnswers?: number | null,
    negativeMarks?: number | null,
    finalMarks?: number | null,
    percentage?: number | null,
    resultStatus?: ResultStatus | null,
    rank?: number | null
) {
    try {
        const result = await prisma.examResult.upsert({
            where: { enquiryId },
            update: {
                marks,
                correctAnswers,
                wrongAnswers,
                negativeMarks,
                finalMarks,
                percentage,
                result: resultStatus,
                rank
            },
            create: {
                enquiryId,
                marks,
                correctAnswers,
                wrongAnswers,
                negativeMarks,
                finalMarks,
                percentage,
                result: resultStatus,
                rank
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
