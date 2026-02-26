import { uploadImageAction, deleteImageAction } from "@/actions/cloudinary";

/**
 * Utility to upload an image from the client side using a server action.
 * This encapsulates the logic so it can be reused across different pages.
 */
export async function uploadImageClient(base64: string, folder: string = "general") {
    const response = await uploadImageAction(base64, folder);
    
    if (!response.success) {
        throw new Error(response.error);
    }
    
    return {
        public_id: response.public_id!,
        url: response.url!
    };
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
