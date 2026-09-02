-- CreateTable
CREATE TABLE "product_bundle_items" (
    "id" UUID NOT NULL,
    "parent_product_id" UUID NOT NULL,
    "bundled_product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_bundle_items_parent_product_id_idx" ON "product_bundle_items"("parent_product_id");

-- CreateIndex
CREATE INDEX "product_bundle_items_bundled_product_id_idx" ON "product_bundle_items"("bundled_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_bundle_items_parent_product_id_bundled_product_id_key" ON "product_bundle_items"("parent_product_id", "bundled_product_id");

-- AddForeignKey
ALTER TABLE "product_bundle_items" ADD CONSTRAINT "product_bundle_items_parent_product_id_fkey" FOREIGN KEY ("parent_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_bundle_items" ADD CONSTRAINT "product_bundle_items_bundled_product_id_fkey" FOREIGN KEY ("bundled_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
