/*
  Warnings:

  - You are about to drop the column `name` on the `Client` table. All the data in the column will be lost.
  - Added the required column `Firstname` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Lastname` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "name",
ADD COLUMN     "Firstname" TEXT NOT NULL,
ADD COLUMN     "Lastname" TEXT NOT NULL,
ALTER COLUMN "avantage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Contra" ADD COLUMN     "steps" TEXT[];
