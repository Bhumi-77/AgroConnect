/*
  Warnings:

  - You are about to drop the column `category` on the `DemandPost` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `DemandPost` table. All the data in the column will be lost.
  - You are about to drop the column `municipality` on the `DemandPost` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `DemandPost` table. All the data in the column will be lost.
  - You are about to drop the column `titleNp` on the `DemandPost` table. All the data in the column will be lost.
  - Added the required column `buyerName` to the `DemandPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerPhone` to the `DemandPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cropName` to the `DemandPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryAddress` to the `DemandPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredDistrict` to the `DemandPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DemandPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
-- Delete the existing test row so we can restructure the table
DELETE FROM "DemandPost";

-- Drop old columns
ALTER TABLE "DemandPost" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "DemandPost" DROP COLUMN IF EXISTS "titleNp";
ALTER TABLE "DemandPost" DROP COLUMN IF EXISTS "category";
ALTER TABLE "DemandPost" DROP COLUMN IF EXISTS "district";
ALTER TABLE "DemandPost" DROP COLUMN IF EXISTS "municipality";

-- Add new columns with temporary defaults
ALTER TABLE "DemandPost" ADD COLUMN "cropName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DemandPost" ADD COLUMN "budget" DOUBLE PRECISION;
ALTER TABLE "DemandPost" ADD COLUMN "preferredDistrict" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DemandPost" ADD COLUMN "preferredMunicipality" TEXT;
ALTER TABLE "DemandPost" ADD COLUMN "deliveryAddress" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DemandPost" ADD COLUMN "description" TEXT;
ALTER TABLE "DemandPost" ADD COLUMN "buyerName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DemandPost" ADD COLUMN "buyerPhone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DemandPost" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove temporary defaults
ALTER TABLE "DemandPost" ALTER COLUMN "cropName" DROP DEFAULT;
ALTER TABLE "DemandPost" ALTER COLUMN "preferredDistrict" DROP DEFAULT;
ALTER TABLE "DemandPost" ALTER COLUMN "deliveryAddress" DROP DEFAULT;
ALTER TABLE "DemandPost" ALTER COLUMN "buyerName" DROP DEFAULT;
ALTER TABLE "DemandPost" ALTER COLUMN "buyerPhone" DROP DEFAULT;