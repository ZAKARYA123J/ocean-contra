/*
  Warnings:

  - You are about to drop the column `avantage` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "avantage";

-- AlterTable
ALTER TABLE "Contra" ADD COLUMN     "avantage" TEXT;
