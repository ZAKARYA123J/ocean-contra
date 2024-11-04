/*
  Warnings:

  - Added the required column `status` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CONFIRMED', 'INCOMPLETED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Dossier" ADD COLUMN     "status" "Status" NOT NULL;
