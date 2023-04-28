-- CreateTable
CREATE TABLE "current_week_consumption" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION,
    "fuel_in_liters" DOUBLE PRECISION,
    "fuel_type" TEXT,
    "fuel_station_id" TEXT,
    "week" TIMESTAMP(3),
    "source_id" TEXT,
    "fuel_station_region" TEXT,
    "company_id" TEXT,
    "transaction_count" INTEGER,
    "reason_type_code" TEXT,

    CONSTRAINT "current_week_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "current_month_consumption" (
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
    "reason_type_code" TEXT,

    CONSTRAINT "current_month_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "current_week_consumption_fuel_type_fuel_station_id_source_i_key" ON "current_week_consumption"("fuel_type", "fuel_station_id", "source_id", "week");

-- CreateIndex
CREATE UNIQUE INDEX "current_month_consumption_fuel_type_fuel_station_id_source__key" ON "current_month_consumption"("fuel_type", "fuel_station_id", "source_id", "month");
