/*
  Warnings:

  - Added the required column `user_id` to the `inventory` table without a default value. This is not possible if the table is not empty.

  Manual fix: Column added as nullable first, backfilled with the first available user (for existing dev rows),
  then the NOT NULL constraint is enforced.
*/

-- Step 1: Add column as nullable so existing rows are not rejected
ALTER TABLE "inventory" ADD COLUMN "user_id" UUID;

-- Step 2: Backfill existing rows with the first available user id
UPDATE "inventory" SET "user_id" = (SELECT "id" FROM "users" ORDER BY "created_at" ASC LIMIT 1) WHERE "user_id" IS NULL;

-- Step 3: Enforce NOT NULL now that all rows have a value
ALTER TABLE "inventory" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
