"use server";

import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";

/**
 * Server action to upload an image to Cloudinary.
 * This can be called from the client to "handle the image on client side".
 */
export async function uploadImageAction(base64: string, folder: string = "general") {
    try {
        // Validate input
        if (!base64) {
            return {
                success: false,
                error: "No image data provided"
            };
        }
        
        if (!base64.startsWith('data:')) {
            return {
                success: false,
                error: "Invalid image format - must be base64 data URL"
            };
        }
        
        // Check if base64 data is reasonable size (prevent massive payloads)
        const base64Data = base64.split(',')[1];
        if (!base64Data) {
            return {
                success: false,
                error: "Invalid base64 format"
            };
        }
        
        // Rough size check - if base64 is larger than ~5MB, reject
        if (base64Data.length > 7000000) { // ~5MB when decoded
            return {
                success: false,
                error: "Image too large - maximum 5MB allowed"
            };
        }
        
        const result = await uploadToCloudinary(base64, folder);
        
        if (!result || !result.url || !result.public_id) {
            return {
                success: false,
                error: "Upload succeeded but missing response data"
            };
        }
        
        return {
            success: true,
            public_id: result.public_id,
            url: result.url
        };
    } catch (error: any) {
        console.error("Cloudinary upload action error:", error);
        return {
            success: false,
            error: error.message || "Failed to upload image"
        };
    }
}

/**
 * Server action to delete an image from Cloudinary.
 */
export async function deleteImageAction(publicId: string) {
    try {
        if (!publicId) throw new Error("No public ID provided");
        
        await deleteFromCloudinary(publicId);
        return { success: true };
    } catch (error: any) {
        console.error("Cloudinary delete action error:", error);
        return {
            success: false,
            error: error.message || "Failed to delete image"
        };
    }
}
