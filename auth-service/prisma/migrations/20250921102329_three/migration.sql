/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `refresh_token_hash` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Auth" DROP COLUMN "refresh_token",
ADD COLUMN     "refresh_token_hash" TEXT NOT NULL;
