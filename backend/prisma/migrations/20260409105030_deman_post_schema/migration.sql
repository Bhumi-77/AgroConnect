-- DropForeignKey
ALTER TABLE "DemandPost" DROP CONSTRAINT "DemandPost_buyerId_fkey";

-- AlterTable
ALTER TABLE "DemandPost" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "DemandPost" ADD CONSTRAINT "DemandPost_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
