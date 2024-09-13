-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
