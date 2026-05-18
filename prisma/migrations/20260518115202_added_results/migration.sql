-- AlterTable
ALTER TABLE `examresult` ADD COLUMN `correctAnswers` INTEGER NULL,
    ADD COLUMN `finalMarks` DOUBLE NULL,
    ADD COLUMN `negativeMarks` DOUBLE NULL,
    ADD COLUMN `percentage` DOUBLE NULL,
    ADD COLUMN `result` ENUM('PASS', 'FAIL') NULL,
    ADD COLUMN `wrongAnswers` INTEGER NULL;
