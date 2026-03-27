"use server";

import { prisma } from "@/config/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/cloudinary";
import { cacheTag, updateTag } from "next/cache";
import { Prisma, EnquiryStatus } from "../../generated/prisma/client";
import { sendEmail } from "@/config/email";
import { schoolEnquiryEmailTemplate } from "@/constants/school-enquiry-email";

/**
 * Create a new School Enquiry
 */
export async function createSchoolEnquiry(data: {
    name: string;
    mobile: string;
    email: string;
    school: string;
    class: string;
    board: string;
    aadhaar: string;
    examCenterId: number;
    // Base64 images for server-side upload
    photoBase64?: string;
    paymentBase64: string;
}) {
    const uploadedPublicIds: string[] = [];

    try {
        // 0. Upload images on the server side First
        let photoData;
        if (data.photoBase64) {
            photoData = await uploadToCloudinary(data.photoBase64, "school-enquiries");
            uploadedPublicIds.push(photoData.public_id);
        } else {
            photoData = {
                url: "https://media.istockphoto.com/id/178851574/vector/male-and-female-profile-picture.jpg?s=612x612&w=0&k=20&c=UyiKWUvzojP2EWM5l1ItQ4WKx-8ycF6joBBgqr7CRKc=",
                public_id: `default_profile_${Math.random().toString(36).substring(2, 10)}`
            };
        }

        const paymentData = await uploadToCloudinary(data.paymentBase64, "school-enquiries");
        uploadedPublicIds.push(paymentData.public_id);

        // 1. Check if exam center has available seats
        const examCenterCount = await prisma.schoolEnquiry.count({
            where: { examCenterId: data.examCenterId }
        });

        if (examCenterCount >= 250) {
            throw new Error("Selected exam center is full. Please choose another exam center.");
        }

        // 2. Generate unique 6-digit registration number
        let registrationNumber = "";
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loop
        
        while (!isUnique && attempts < maxAttempts) {
            registrationNumber = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number between 100000-999999
            const existing = await prisma.schoolEnquiry.findUnique({
                where: { registrationNumber }
            });
            
            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }
        
        if (!isUnique) {
            throw new Error("Unable to generate unique registration number. Please try again.");
        }

        // 3. Create record
        const enquiry = await prisma.schoolEnquiry.create({
            data: {
                name: data.name,
                mobile: data.mobile,
                email: data.email,
                school: data.school,
                class: data.class,
                board: data.board,
                aadhaar: data.aadhaar,
                examCenterId: data.examCenterId,
                registrationNumber: registrationNumber!,
                status: "APPROVED" as EnquiryStatus,
                photo: photoData,
                payment: paymentData,
            },
        });

        // 3. Send confirmation email
        if (data.email) {
            try {
                await sendEmail({
                    to: data.email,
                    subject: `School Enquiry Confirmation - Reg No: ${registrationNumber} | Jharkhand Jan Kalyan Trust`,
                    html: schoolEnquiryEmailTemplate(data.name, registrationNumber!, data.school)
                });
            } catch (emailError) {
                // We don't fail the enquiry if only the email fails
                console.error("Error sending school enquiry email:", emailError);
            }
        }

        updateTag("school-enquiries");
        return { success: true, data: enquiry };
    } catch (error: any) {
        console.error("Error creating school enquiry:", error);

        // CLEANUP: If anything goes wrong, delete the pre-uploaded images from Cloudinary
        if (uploadedPublicIds.length > 0) {
            console.log("Cleaning up uploaded images due to server failure...");
            await Promise.allSettled(
                uploadedPublicIds.map(pid => deleteFromCloudinary(pid))
            );
        }

        return { success: false, error: error.message || "Failed to create school enquiry" };
    }
}

/**
 * Get School Enquiries with Pagination and Advanced Filtering
 */
export async function getAllSchoolEnquiries(options?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    status?: EnquiryStatus;
    search?: string;
}) {
    "use cache";
    cacheTag("school-enquiries");

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SchoolEnquiryWhereInput = { AND: [] };

    // Date Filtering
    if (options?.startDate || options?.endDate) {
        where.createdAt = {};
        if (options.startDate) where.createdAt.gte = new Date(options.startDate);
        if (options.endDate) where.createdAt.lte = new Date(options.endDate);
    }

    // Status Filter
    if (options?.status) where.status = options.status;

    // Multi-field Search (including registrationNumber)
    if (options?.search) {
        where.OR = [
            { name: { contains: options.search } },
            { mobile: { contains: options.search } },
            { email: { contains: options.search } },
            { school: { contains: options.search } },
            { board: { contains: options.search } },
            { registrationNumber: { contains: options.search } },
        ];
    }

    try {
        const [enquiries, total] = await Promise.all([
            prisma.schoolEnquiry.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    examCenter: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            city: true,
                            state: true,
                        }
                    },
                    examResult: true
                }
            }),
            prisma.schoolEnquiry.count({ where }),
        ]);

        return {
            enquiries,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error: any) {
        console.error("Error fetching school enquiries:", error);
        throw new Error(error.message);
    }
}

/**
 * Get School Enquiry by ID
 */
export async function getSchoolEnquiryById(id: number) {
    "use cache";
    cacheTag(`school-enquiry-${id}`, "school-enquiries");
    try {
        return await prisma.schoolEnquiry.findUnique({
            where: { id },
            include: {
                examCenter: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        state: true,
                        pinCode: true,
                        mobile: true,
                        email: true,
                    }
                },
                examResult: true
            }
        });
    } catch (error: any) {
        console.error("Error fetching school enquiry:", error);
        throw new Error(error.message);
    }
}

/**
 * Get School Enquiry by Registration Number
 */
export async function getSchoolEnquiryByRegistrationNumber(registrationNumber: string) {
    "use cache";
    cacheTag(`school-enquiry-reg-${registrationNumber}`, "school-enquiries");
    try {
        return await prisma.schoolEnquiry.findUnique({
            where: { registrationNumber },
            include: {
                examCenter: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        state: true,
                        pinCode: true,
                        mobile: true,
                        email: true,
                    }
                },
                examResult: true
            }
        });
    } catch (error: any) {
        console.error("Error fetching school enquiry by registration number:", error);
        throw new Error(error.message);
    }
}

/**
 * Update School Enquiry
 */
export async function updateSchoolEnquiry(
    id: number,
    data: {
        name?: string;
        mobile?: string;
        email?: string;
        school?: string;
        class?: string;
        board?: string;
        examCenterId?: number;
        photo?: string; // base64
        payment?: string; // base64
        status?: EnquiryStatus;
    }
) {
    try {
        const existing = await prisma.schoolEnquiry.findUnique({ where: { id } });
        if (!existing) throw new Error("School enquiry not found");

        // Check if exam center is being changed and has available seats
        if (data.examCenterId && data.examCenterId !== existing.examCenterId) {
            const examCenterCount = await prisma.schoolEnquiry.count({
                where: { examCenterId: data.examCenterId }
            });

            if (examCenterCount >= 500) {
                throw new Error("Selected exam center is full. Please choose another exam center.");
            }
        }

        const updateData: any = { ...data };

        // Handle Status Update
        if (data.status) {
            updateData.status = data.status;
        }

        // Handle Image Updates
        if (data.photo && data.photo.startsWith('data:')) {
            const existingPhoto = existing.photo as any;
            if (existingPhoto?.public_id) {
                await deleteFromCloudinary(existingPhoto.public_id);
            }
            const uploadRes = await uploadToCloudinary(data.photo, "school-enquiries");
            updateData.photo = { url: uploadRes.url, public_id: uploadRes.public_id };
        } else {
            delete updateData.photo;
        }

        if (data.payment && data.payment.startsWith('data:')) {
            const existingPayment = existing.payment as any;
            if (existingPayment?.public_id) {
                await deleteFromCloudinary(existingPayment.public_id);
            }
            const uploadRes = await uploadToCloudinary(data.payment, "school-enquiries");
            updateData.payment = { url: uploadRes.url, public_id: uploadRes.public_id };
        } else {
            delete updateData.payment;
        }

        const updated = await prisma.schoolEnquiry.update({
            where: { id },
            data: updateData
        });

        updateTag("school-enquiries");
        updateTag(`school-enquiry-${id}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating school enquiry:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete School Enquiry with Cloudinary Cleanup
 */
export async function deleteSchoolEnquiry(id: number) {
    try {
        const existing = await prisma.schoolEnquiry.findUnique({ where: { id } });
        if (!existing) throw new Error("School enquiry not found");

        const imagesToDelete = [
            (existing.photo as any)?.public_id,
            (existing.payment as any)?.public_id,
        ].filter(Boolean);

        await Promise.all(imagesToDelete.map(pid => deleteFromCloudinary(pid)));

        await prisma.schoolEnquiry.delete({ where: { id } });

        updateTag("school-enquiries");
        updateTag(`school-enquiry-${id}`);

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting school enquiry:", error);
        return { success: false, error: error.message };
    }
}
