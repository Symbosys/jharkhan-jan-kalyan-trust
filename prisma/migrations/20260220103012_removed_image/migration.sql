/*
  Warnings:

  - You are about to drop the column `image` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `news` DROP COLUMN `image`,
    DROP COLUMN `videoUrl`,
    ADD COLUMN `link` VARCHAR(191) NULL;
