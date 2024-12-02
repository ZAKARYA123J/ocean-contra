/*
  Warnings:

  - You are about to drop the column `clientId` on the `Register` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registerId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Register" DROP CONSTRAINT "Register_clientId_fkey";

-- DropIndex
DROP INDEX "Register_clientId_key";

-- AlterTable
ALTER TABLE "Register" DROP COLUMN "clientId";

-- CreateIndex
CREATE UNIQUE INDEX "Client_registerId_key" ON "Client"("registerId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "Register"("id") ON DELETE SET NULL ON UPDATE CASCADE;
