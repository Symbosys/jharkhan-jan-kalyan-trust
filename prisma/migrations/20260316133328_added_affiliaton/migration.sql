-- CreateTable
CREATE TABLE `Affiliation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationName` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NULL,
    `establishedYear` INTEGER NOT NULL,
    `organizationType` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `directorName` VARCHAR(191) NOT NULL,
    `directorMobile` VARCHAR(191) NOT NULL,
    `directorEmail` VARCHAR(191) NULL,
    `documents` JSON NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
