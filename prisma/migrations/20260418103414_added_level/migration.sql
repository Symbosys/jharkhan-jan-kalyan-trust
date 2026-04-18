-- AlterTable
ALTER TABLE `schoolenquiry` ADD COLUMN `level` ENUM('ONE', 'TWO', 'THREE') NOT NULL DEFAULT 'ONE';
