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
    const result = await cloudinary.uploader.upload(file, {
      folder: `${cloudinaryFolder}/${folder}`,
      resource_type: "auto",
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
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
