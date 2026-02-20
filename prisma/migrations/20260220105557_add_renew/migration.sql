-- AlterTable
ALTER TABLE `membership` ADD COLUMN `expiresAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `MembershipRenewal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `paymentMode` ENUM('BANK_TRANSFER', 'PAYTM', 'GOOGLE_PAY', 'PHONE_PE', 'AMAZON_PAY', 'CHEQUE', 'CASH', 'OTHER') NOT NULL,
    `paymentProof` JSON NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `adminComment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MembershipRenewal` ADD CONSTRAINT `MembershipRenewal_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `MemberShip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembershipRenewal` ADD CONSTRAINT `MembershipRenewal_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `MemberShipPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
