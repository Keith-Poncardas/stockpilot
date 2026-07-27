-- AlterTable
ALTER TABLE "stock_movements" ADD COLUMN     "reason" "MovementReason" NOT NULL DEFAULT 'INITIAL_STOCK';
