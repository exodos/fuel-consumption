/*
  Warnings:

  - The values [PAYED,NOTPAYED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `premiumTarif` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('Payed', 'Pending');
ALTER TABLE "Payment" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "paymentStatus" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "premiumTarif" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "paymentStatus" SET DEFAULT 'Pending';
