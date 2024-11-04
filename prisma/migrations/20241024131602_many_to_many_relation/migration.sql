/*
  Warnings:

  - You are about to drop the column `contraId` on the `Secture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Secture" DROP CONSTRAINT "Secture_contraId_fkey";

-- AlterTable
ALTER TABLE "Secture" DROP COLUMN "contraId";

-- CreateTable
CREATE TABLE "_ContraSecture" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContraSecture_AB_unique" ON "_ContraSecture"("A", "B");

-- CreateIndex
CREATE INDEX "_ContraSecture_B_index" ON "_ContraSecture"("B");

-- AddForeignKey
ALTER TABLE "_ContraSecture" ADD CONSTRAINT "_ContraSecture_A_fkey" FOREIGN KEY ("A") REFERENCES "Contra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContraSecture" ADD CONSTRAINT "_ContraSecture_B_fkey" FOREIGN KEY ("B") REFERENCES "Secture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
