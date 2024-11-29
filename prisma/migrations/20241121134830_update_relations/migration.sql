-- DropForeignKey
ALTER TABLE "Dossier" DROP CONSTRAINT "Dossier_idClient_fkey";

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Register"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
