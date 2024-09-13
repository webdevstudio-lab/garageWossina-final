/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "userid" SERIAL NOT NULL,
    "createAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(65) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "restePasswordToken" VARCHAR(100) DEFAULT 'null',
    "restePasswordExpiresAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationToken" VARCHAR(10) NOT NULL,
    "verificationTokenExpiresAt" TIMESTAMP NOT NULL,
    "refreshToken" VARCHAR(255) NOT NULL DEFAULT 'null',
    "passUpdateAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devis" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "numDevis" VARCHAR(255) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matricule" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "hasFacture" BOOLEAN NOT NULL DEFAULT false,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facture" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "numFacture" VARCHAR(255) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matricule" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "etat" VARCHAR(255) NOT NULL DEFAULT 'En Attente',
    "numDevis" VARCHAR(255) NOT NULL DEFAULT 'NA',
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemsFactures" (
    "itemId" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitePrice" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "factureId" INTEGER NOT NULL,

    CONSTRAINT "itemsFactures_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "itemDevis" (
    "itemId" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitePrice" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "devisId" INTEGER NOT NULL,

    CONSTRAINT "itemDevis_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "setting" (
    "userid" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "FactureYear" INTEGER NOT NULL,
    "DevisYear" INTEGER NOT NULL,
    "factureRemise" DOUBLE PRECISION NOT NULL,
    "devisRemise" DOUBLE PRECISION NOT NULL,
    "Reduction" DOUBLE PRECISION NOT NULL,
    "Taxe" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "vehicile" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "matricule" VARCHAR(255) NOT NULL,
    "marque" VARCHAR(20) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "dateVisite" TIMESTAMP(3) NOT NULL,
    "nomClient" VARCHAR(255) NOT NULL,
    "contact" VARCHAR(255) NOT NULL,
    "kilometrage" INTEGER NOT NULL,

    CONSTRAINT "vehicile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_phone_key" ON "client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "vehicile_matricule_key" ON "vehicile"("matricule");

-- AddForeignKey
ALTER TABLE "devis" ADD CONSTRAINT "devis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facture" ADD CONSTRAINT "facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemsFactures" ADD CONSTRAINT "itemsFactures_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemDevis" ADD CONSTRAINT "itemDevis_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
