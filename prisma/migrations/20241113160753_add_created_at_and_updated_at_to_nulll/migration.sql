-- DropForeignKey
ALTER TABLE "Register" DROP CONSTRAINT "Register_clientId_fkey";

-- AlterTable
ALTER TABLE "Register" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Register" ADD CONSTRAINT "Register_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
