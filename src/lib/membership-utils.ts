import { PlanDurationType } from "../../generated/prisma/client";

/**
 * Helper function to calculate expiration date based on plan duration
 */
export function calculateExpirationDate(
    planDuration: number, 
    durationType: PlanDurationType, 
    fromDate: Date = new Date()
): Date | null {
    if (durationType === "LIFETIME") return null;

    const expiry = new Date(fromDate);
    if (durationType === "MONTH") {
        expiry.setMonth(expiry.getMonth() + planDuration);
    } else if (durationType === "YEAR") {
        expiry.setFullYear(expiry.getFullYear() + planDuration);
    }
    return expiry;
}
