-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'USER', 'ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "mobile_number" TEXT NOT NULL,
    "admin_reset_password" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumption" (
    "id" SERIAL NOT NULL,
    "transaction_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "fuel_in_liters" DOUBLE PRECISION,
    "fuel_type" TEXT,
    "plate_code" TEXT NOT NULL,
    "plate_region" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3),
    "debit_account_number" TEXT,
    "credit_account_number" TEXT,
    "fuel_station_id" TEXT,
    "fuel_station_region" TEXT,
    "fuel_station_name" TEXT,
    "fuel_station_zone" TEXT,
    "fuel_station_woreda" TEXT,
    "fuel_station_kebele" TEXT,
    "last_kilometer" INTEGER,
    "reason_type_name" TEXT,
    "reason_type_code" TEXT,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "mobile_number" TEXT,
    "source_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumption_pkey" PRIMARY KEY ("transaction_number","plate_code","plate_region","plate_number")
);

-- CreateTable
CREATE TABLE "daily_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION,
    "fuel_in_liters" DOUBLE PRECISION,
    "fuel_type" TEXT,
    "fuel_station_id" TEXT,
    "day" TIMESTAMP(3) NOT NULL,
    "source_id" TEXT NOT NULL,
    "fuel_station_region" TEXT,
    "company_id" TEXT,
    "transaction_count" INTEGER,

    CONSTRAINT "daily_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION,
    "fuel_in_liters" DOUBLE PRECISION,
    "fuel_type" TEXT,
    "fuel_station_id" TEXT,
    "week" TIMESTAMP(3) NOT NULL,
    "source_id" TEXT,
    "fuel_station_region" TEXT,
    "company_id" TEXT,
    "transaction_count" INTEGER,

    CONSTRAINT "weekly_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION,
    "fuel_in_liters" DOUBLE PRECISION,
    "fuel_type" TEXT,
    "fuel_station_id" TEXT,
    "month" TIMESTAMP(3),
    "source_id" TEXT,
    "fuel_station_region" TEXT,
    "company_id" TEXT,
    "transaction_count" INTEGER,

    CONSTRAINT "monthly_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_number_key" ON "user"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "daily_consumption_fuel_type_fuel_station_id_source_id_day_key" ON "daily_consumption"("fuel_type", "fuel_station_id", "source_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_consumption_fuel_type_fuel_station_id_source_id_week_key" ON "weekly_consumption"("fuel_type", "fuel_station_id", "source_id", "week");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_consumption_fuel_type_fuel_station_id_source_id_mon_key" ON "monthly_consumption"("fuel_type", "fuel_station_id", "source_id", "month");
