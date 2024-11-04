/*
  Warnings:

  - You are about to drop the column `idSecture` on the `Contra` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contra" DROP CONSTRAINT "Contra_idSecture_fkey";

-- AlterTable
ALTER TABLE "Contra" DROP COLUMN "idSecture";

-- AlterTable
ALTER TABLE "Secture" ADD COLUMN     "contraId" INTEGER;

-- AddForeignKey
ALTER TABLE "Secture" ADD CONSTRAINT "Secture_contraId_fkey" FOREIGN KEY ("contraId") REFERENCES "Contra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
