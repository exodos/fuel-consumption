-- CreateEnum
CREATE TYPE "fuel_type_enum" AS ENUM ('Diesel', 'Benzene');

-- CreateEnum
CREATE TYPE "plate_region_enum" AS ENUM ('AA', 'AM', 'OR', 'TG', 'HR');

-- CreateTable
CREATE TABLE "consumption" (
    "id" SERIAL NOT NULL,
    "transaction_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_type" "fuel_type_enum" NOT NULL,
    "plate_code" INTEGER NOT NULL,
    "plate_region" "plate_region_enum" NOT NULL,
    "plate_number" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "debit_account_number" TEXT NOT NULL,
    "credit_account_number" TEXT NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "fuel_station_region" TEXT NOT NULL,
    "fuel_station_name" TEXT NOT NULL,
    "fuel_station_zone" TEXT NOT NULL,
    "fuel_station_woreda" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "source_id" INTEGER NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumption_pkey" PRIMARY KEY ("transaction_number","plate_code","plate_region","plate_number")
);

-- CreateTable
CREATE TABLE "daily_consumption" (
    "amount" DOUBLE PRECISION NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "fuel_type" "fuel_type_enum" NOT NULL,
    "source_id" INTEGER NOT NULL,

    CONSTRAINT "daily_consumption_pkey" PRIMARY KEY ("day","fuel_station_id")
);

-- CreateTable
CREATE TABLE "weekly_consumption" (
    "amount" DOUBLE PRECISION NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "fuel_type" "fuel_type_enum" NOT NULL,
    "source_id" INTEGER NOT NULL,

    CONSTRAINT "weekly_consumption_pkey" PRIMARY KEY ("week","fuel_station_id")
);

-- CreateTable
CREATE TABLE "monthly_consumption" (
    "amount" DOUBLE PRECISION NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "fuel_type" "fuel_type_enum" NOT NULL,
    "source_id" INTEGER NOT NULL,

    CONSTRAINT "monthly_consumption_pkey" PRIMARY KEY ("month","fuel_station_id")
);
