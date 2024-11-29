-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CONFIRMED', 'INCOMPLETED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "StatuClient" AS ENUM ('Pending', 'verified', 'inverified');

-- CreateTable
CREATE TABLE "Register" (
    "id" SERIAL NOT NULL,
    "Firstname" TEXT NOT NULL,
    "Lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "StatuClient" "StatuClient" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Register_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "CIN" TEXT,
    "CINFront" TEXT,
    "CINBackground" TEXT,
    "secture" TEXT,
    "city" TEXT,
    "address" TEXT,
    "zipCode" TEXT,
    "passport" TEXT,
    "diplomat" TEXT,
    "images" TEXT,
    "apostyle" TEXT,
    "addaDocument" TEXT[],
    "registerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dossier" (
    "id" SERIAL NOT NULL,
    "idClient" INTEGER NOT NULL,
    "idContra" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contra" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "titleCity" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "levelLangue" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "steps" TEXT[],
    "avantage" TEXT,

    CONSTRAINT "Contra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secture" (
    "id" SERIAL NOT NULL,
    "nameSecture" TEXT NOT NULL,

    CONSTRAINT "Secture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContraSecture" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Register_email_key" ON "Register"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_registerId_key" ON "Client"("registerId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContraSecture_AB_unique" ON "_ContraSecture"("A", "B");

-- CreateIndex
CREATE INDEX "_ContraSecture_B_index" ON "_ContraSecture"("B");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "Register"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_idContra_fkey" FOREIGN KEY ("idContra") REFERENCES "Contra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContraSecture" ADD CONSTRAINT "_ContraSecture_A_fkey" FOREIGN KEY ("A") REFERENCES "Contra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContraSecture" ADD CONSTRAINT "_ContraSecture_B_fkey" FOREIGN KEY ("B") REFERENCES "Secture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
