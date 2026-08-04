/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `stock_movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "deleted_at";
