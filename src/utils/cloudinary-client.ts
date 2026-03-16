import { uploadImageAction, deleteImageAction } from "@/actions/cloudinary";

/**
 * Utility to upload an image from the client side using a server action.
 * This encapsulates the logic so it can be reused across different pages.
 */
export async function uploadImageClient(base64: string, folder: string = "general") {
    // Validate input
    if (!base64) {
        throw new Error("No image data provided");
    }
    
    if (!base64.startsWith('data:')) {
        throw new Error("Invalid image format - must be base64 data URL");
    }
    
    try {
        const response = await uploadImageAction(base64, folder);
        
        if (!response.success) {
            throw new Error(response.error || "Upload failed");
        }
        
        if (!response.public_id || !response.url) {
            throw new Error("Upload succeeded but missing required data");
        }
        
        return {
            public_id: response.public_id,
            url: response.url
        };
    } catch (error: any) {
        console.error("Cloudinary client upload error:", error);
        throw new Error(error.message || "Failed to upload image");
    }
}

/**
 * Utility to delete an image from the client side using a server action.
 */
export async function deleteImageClient(publicId: string) {
    const response = await deleteImageAction(publicId);
    
    if (!response.success) {
        throw new Error(response.error);
    }
    
    return true;
}
