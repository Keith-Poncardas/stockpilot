-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SIMPLE', 'BUNDLE');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "product_type" "ProductType" NOT NULL DEFAULT 'SIMPLE',
ADD COLUMN     "regular_price" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "product_pricing_tiers" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "max_quantity" INTEGER,
    "tier_price" DECIMAL(10,2) NOT NULL,
    "free_product_id" UUID,
    "free_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_pricing_tiers_product_id_idx" ON "product_pricing_tiers"("product_id");

-- CreateIndex
CREATE INDEX "product_pricing_tiers_free_product_id_idx" ON "product_pricing_tiers"("free_product_id");

-- AddForeignKey
ALTER TABLE "product_pricing_tiers" ADD CONSTRAINT "product_pricing_tiers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_pricing_tiers" ADD CONSTRAINT "product_pricing_tiers_free_product_id_fkey" FOREIGN KEY ("free_product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
