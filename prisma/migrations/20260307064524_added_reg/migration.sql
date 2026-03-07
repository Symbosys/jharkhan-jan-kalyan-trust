/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `SchoolEnquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `schoolenquiry` ADD COLUMN `registrationNumber` VARCHAR(191) NOT NULL DEFAULT 'NOT PROVIDED',
    ADD COLUMN `status` ENUM('PENDING', 'VERIFIED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `SchoolEnquiry_registrationNumber_key` ON `SchoolEnquiry`(`registrationNumber`);
