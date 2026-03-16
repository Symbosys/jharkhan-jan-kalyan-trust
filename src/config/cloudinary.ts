import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const cloudinaryFolder = process.env.CLOUD_FOLDER || "symbosys";

/**
 * Upload an image to Cloudinary
 * @param file - Base64 string or file path
 */
export const uploadToCloudinary = async (file: string, folder?: string) => {
  try {
    // Validate Cloudinary configuration
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
      throw new Error("Cloudinary configuration is missing");
    }
    
    const result = await cloudinary.uploader.upload(file, {
      folder: `${cloudinaryFolder}/${folder}`,
      resource_type: "auto",
      timeout: 60000, // 60 second timeout
    });
    
    if (!result || !result.secure_url || !result.public_id) {
      throw new Error("Cloudinary upload succeeded but missing response data");
    }
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    // Provide more specific error messages
    if (error.http_code === 401) {
      throw new Error("Cloudinary authentication failed - check API credentials");
    } else if (error.http_code === 413) {
      throw new Error("File too large for Cloudinary");
    } else if (error.http_code === 422) {
      throw new Error("Invalid file format");
    }
    throw new Error(error.message || "Failed to upload to Cloudinary");
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

export default cloudinary;
