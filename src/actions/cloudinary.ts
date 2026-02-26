"use server";

import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";

/**
 * Server action to upload an image to Cloudinary.
 * This can be called from the client to "handle the image on client side".
 */
export async function uploadImageAction(base64: string, folder: string = "general") {
    try {
        if (!base64) throw new Error("No image data provided");
        
        const result = await uploadToCloudinary(base64, folder);
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
