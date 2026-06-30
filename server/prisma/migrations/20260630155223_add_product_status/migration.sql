/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "deleted_at",
DROP COLUMN "is_active",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT';
