-- CreateTable
CREATE TABLE "public"."Credentials" (
    "id" SERIAL NOT NULL,
    "password_hash" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
);
