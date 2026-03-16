/*
  Warnings:

  - A unique constraint covering the columns `[AffiliationNumber]` on the table `Affiliation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `affiliation` ADD COLUMN `AffiliationNumber` VARCHAR(191) NOT NULL DEFAULT 'NOT PROVIDED',
    ADD COLUMN `validFrom` DATETIME(3) NULL,
    ADD COLUMN `validTill` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Affiliation_AffiliationNumber_key` ON `Affiliation`(`AffiliationNumber`);
