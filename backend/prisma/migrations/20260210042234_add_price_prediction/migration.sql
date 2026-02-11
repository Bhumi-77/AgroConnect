-- CreateTable
CREATE TABLE "MarketPrice" (
    "id" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "municipality" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricePrediction" (
    "id" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "municipality" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "horizonDays" INTEGER NOT NULL,
    "predicted" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketPrice_cropName_district_date_idx" ON "MarketPrice"("cropName", "district", "date");

-- CreateIndex
CREATE INDEX "PricePrediction_cropName_district_createdAt_idx" ON "PricePrediction"("cropName", "district", "createdAt");

-- AddForeignKey
ALTER TABLE "PricePrediction" ADD CONSTRAINT "PricePrediction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
