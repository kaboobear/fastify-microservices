-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'manager', 'admin');

-- AlterTable
ALTER TABLE "public"."Auth" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'user';
