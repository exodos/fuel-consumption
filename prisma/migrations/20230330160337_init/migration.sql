-- CreateTable
CREATE TABLE "consumption" (
    "id" SERIAL NOT NULL,
    "transaction_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "plate_code" TEXT NOT NULL,
    "plate_region" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "debit_account_number" TEXT NOT NULL,
    "credit_account_number" TEXT NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "fuel_station_region" TEXT NOT NULL,
    "fuel_station_name" TEXT NOT NULL,
    "fuel_station_zone" TEXT NOT NULL,
    "fuel_station_woreda" TEXT NOT NULL,
    "fuel_station_kebele" TEXT NOT NULL,
    "last_kilometer" INTEGER NOT NULL,
    "reason_type_name" TEXT NOT NULL,
    "reason_type_code" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumption_pkey" PRIMARY KEY ("transaction_number","plate_code","plate_region","plate_number")
);

-- CreateTable
CREATE TABLE "daily_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "source_id" TEXT NOT NULL,

    CONSTRAINT "daily_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "source_id" TEXT NOT NULL,

    CONSTRAINT "weekly_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fuel_in_liters" DOUBLE PRECISION NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "fuel_station_id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "source_id" TEXT NOT NULL,

    CONSTRAINT "monthly_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_consumption_fuel_type_fuel_station_id_source_id_day_key" ON "daily_consumption"("fuel_type", "fuel_station_id", "source_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_consumption_fuel_type_fuel_station_id_source_id_week_key" ON "weekly_consumption"("fuel_type", "fuel_station_id", "source_id", "week");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_consumption_fuel_type_fuel_station_id_source_id_mon_key" ON "monthly_consumption"("fuel_type", "fuel_station_id", "source_id", "month");
