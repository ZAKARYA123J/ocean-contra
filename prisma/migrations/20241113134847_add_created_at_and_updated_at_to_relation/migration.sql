/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Register` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Register` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_registerId_fkey";

-- DropIndex
DROP INDEX "Client_registerId_key";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "registerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Register" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Register_clientId_key" ON "Register"("clientId");

-- AddForeignKey
ALTER TABLE "Register" ADD CONSTRAINT "Register_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
