/*
  Warnings:

  - Added the required column `updated_at` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address_line1" VARCHAR,
ADD COLUMN     "address_line2" VARCHAR,
ADD COLUMN     "city" VARCHAR,
ADD COLUMN     "country" VARCHAR DEFAULT 'Philippines',
ADD COLUMN     "postal_code" VARCHAR,
ADD COLUMN     "province" VARCHAR,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;
