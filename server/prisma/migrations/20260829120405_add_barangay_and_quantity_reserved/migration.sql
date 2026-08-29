-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "barangay" VARCHAR;

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "quantity_reserved" INTEGER NOT NULL DEFAULT 0;
