-- AlterTable
ALTER TABLE `schoolenquiry` ADD COLUMN `examCenterId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ExamCenter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pinCode` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SchoolEnquiry` ADD CONSTRAINT `SchoolEnquiry_examCenterId_fkey` FOREIGN KEY (`examCenterId`) REFERENCES `ExamCenter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
