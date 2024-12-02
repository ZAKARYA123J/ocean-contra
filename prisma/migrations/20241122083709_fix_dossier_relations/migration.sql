/*
  Warnings:

  - Added the required column `idregister` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dossier" DROP CONSTRAINT "Dossier_idClient_fkey";

-- AlterTable
ALTER TABLE "Dossier" ADD COLUMN     "idregister" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_idregister_fkey" FOREIGN KEY ("idregister") REFERENCES "Register"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
