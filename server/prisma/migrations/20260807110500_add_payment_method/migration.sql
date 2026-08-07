-- CreateEnum safely if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'GCASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "payment_method" TYPE "PaymentMethod" USING "payment_method"::text::"PaymentMethod";
