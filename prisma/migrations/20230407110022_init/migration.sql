-- AlterTable
ALTER TABLE "consumption" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "fuel_in_liters" DROP NOT NULL,
ALTER COLUMN "fuel_type" DROP NOT NULL,
ALTER COLUMN "paid_at" DROP NOT NULL,
ALTER COLUMN "debit_account_number" DROP NOT NULL,
ALTER COLUMN "credit_account_number" DROP NOT NULL,
ALTER COLUMN "fuel_station_id" DROP NOT NULL,
ALTER COLUMN "fuel_station_region" DROP NOT NULL,
ALTER COLUMN "fuel_station_name" DROP NOT NULL,
ALTER COLUMN "fuel_station_zone" DROP NOT NULL,
ALTER COLUMN "fuel_station_woreda" DROP NOT NULL,
ALTER COLUMN "fuel_station_kebele" DROP NOT NULL,
ALTER COLUMN "last_kilometer" DROP NOT NULL,
ALTER COLUMN "reason_type_name" DROP NOT NULL,
ALTER COLUMN "reason_type_code" DROP NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "middle_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "mobile_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "daily_consumption" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "fuel_in_liters" DROP NOT NULL,
ALTER COLUMN "fuel_type" DROP NOT NULL,
ALTER COLUMN "fuel_station_id" DROP NOT NULL,
ALTER COLUMN "source_id" DROP NOT NULL,
ALTER COLUMN "fuel_station_region" DROP NOT NULL,
ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "transaction_count" DROP NOT NULL;

-- AlterTable
ALTER TABLE "monthly_consumption" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "fuel_in_liters" DROP NOT NULL,
ALTER COLUMN "fuel_type" DROP NOT NULL,
ALTER COLUMN "fuel_station_id" DROP NOT NULL,
ALTER COLUMN "month" DROP NOT NULL,
ALTER COLUMN "source_id" DROP NOT NULL,
ALTER COLUMN "fuel_station_region" DROP NOT NULL,
ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "transaction_count" DROP NOT NULL;

-- AlterTable
ALTER TABLE "weekly_consumption" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "fuel_in_liters" DROP NOT NULL,
ALTER COLUMN "fuel_type" DROP NOT NULL,
ALTER COLUMN "fuel_station_id" DROP NOT NULL,
ALTER COLUMN "source_id" DROP NOT NULL,
ALTER COLUMN "fuel_station_region" DROP NOT NULL,
ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "transaction_count" DROP NOT NULL;
