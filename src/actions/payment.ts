"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";

/**
 * Get NGO payment details (singleton record)
 * Following Next.js 16 caching standards.
 */
export async function getPaymentDetails() {
    "use cache";
    cacheTag("paymentdetails");
    try {
        const payment = await prisma.payment.findFirst();
        return payment;
    } catch (error: any) {
        console.error("Error fetching payment details:", error);
        throw new Error(error.message);
    }
}

/**
 * Update or Create NGO payment details (Singleton logic)
 * If a record exists, it updates it. Otherwise, it creates the first one.
 */
export async function upsertPaymentDetails(data: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    image?: string; // base64 or path for QR code or Bank Logo
}) {
    try {
        // 1. Check if a payment record already exists
        const existingPayment = await prisma.payment.findFirst();

        let imageData = existingPayment?.image || {};

        // 2. Handle image upload if a new one is provided
        if (data.image && data.image.startsWith('data:')) {
            // Delete old image from Cloudinary if it exists
            const existingImageData = existingPayment?.image as any;
            if (existingImageData?.public_id) {
                await deleteFromCloudinary(existingImageData.public_id);
            }

            // Upload new image
            const uploadResult = await uploadToCloudinary(data.image, "payments");
            imageData = {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            };
        }

        let result;

        if (existingPayment) {
            // 3. Update the existing record
            result = await prisma.payment.update({
                where: { id: existingPayment.id },
                data: {
                    bankName: data.bankName,
                    accountNumber: data.accountNumber,
                    ifscCode: data.ifscCode,
                    accountHolderName: data.accountHolderName,
                    image: imageData as any,
                },
            });
        } else {
            // 4. Create the first record if none exists
            if (!data.image) {
                throw new Error("Image (QR Code/Logo) is required for the first-time setup.");
            }

            result = await prisma.payment.create({
                data: {
                    bankName: data.bankName,
                    accountNumber: data.accountNumber,
                    ifscCode: data.ifscCode,
                    accountHolderName: data.accountHolderName,
                    image: imageData as any,
                },
            });
        }

        // 5. Invalidate cache tags
        updateTag("paymentdetails");
        
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error upserting payment details:", error);
        return { success: false, error: error.message };
    }
}
