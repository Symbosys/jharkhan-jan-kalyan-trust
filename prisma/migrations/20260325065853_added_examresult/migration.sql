-- CreateTable
CREATE TABLE `ExamResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marks` DOUBLE NOT NULL,
    `enquiryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExamResult_enquiryId_key`(`enquiryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExamResult` ADD CONSTRAINT `ExamResult_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `SchoolEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
