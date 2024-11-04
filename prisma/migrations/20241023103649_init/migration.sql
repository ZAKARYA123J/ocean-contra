-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "CIN" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "avantage" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dossier" (
    "id" SERIAL NOT NULL,
    "uploade" TEXT[],
    "idClient" INTEGER NOT NULL,
    "idContra" INTEGER NOT NULL,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contra" (
    "id" SERIAL NOT NULL,
    "idSecture" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "titleCity" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "levelLangue" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "Contra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secture" (
    "id" SERIAL NOT NULL,
    "nameSecture" TEXT NOT NULL,

    CONSTRAINT "Secture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_idContra_fkey" FOREIGN KEY ("idContra") REFERENCES "Contra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contra" ADD CONSTRAINT "Contra_idSecture_fkey" FOREIGN KEY ("idSecture") REFERENCES "Secture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
