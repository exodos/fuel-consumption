import FuelBySubsidy from "./fuel-by-subsidy";
import { LineChartBySource } from "./linechart-by-source";

const FuelTrendDisplay = ({
  totalDailyFuelBySubsidy,
  totalWeeklyFuelBySubsidy,
  totalMonthlyFuelBySubsidy,
  totalDailyFuel,
  totalWeeklyFuel,
  totalMonthlyFuel,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <FuelBySubsidy
          fuelData={totalDailyFuelBySubsidy}
          title={"Total Daily Fuel With And With Out Subsidy (Litre)"}
          colors={["yellow", "lime"]}
          byIndex={"day"}
        />
        <FuelBySubsidy
          fuelData={totalWeeklyFuelBySubsidy}
          title={"Total Weekly Fuel With And With Out Subsidy (Litre)"}
          colors={["indigo", "fuchsia"]}
          byIndex={"week"}
        />
        <FuelBySubsidy
          fuelData={totalMonthlyFuelBySubsidy}
          title={"Total Monthly Fuel With And With Out Subsidy (Litre)"}
          colors={["emerald", "rose"]}
          byIndex={"month"}
        />
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Daily Consumed Fuel (Litre)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalDailyFuel ?? []}
                colors={{ scheme: "dark2" }}
                legendFor={"Week Days"}
                legendType={"Count"}
              />
            </div>
          </dd>
        </div>
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Weekly Consumed Fuel (Litre)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalWeeklyFuel ?? []}
                colors={{ scheme: "accent" }}
                legendFor={"Week Days"}
                legendType={"Amount(ETB)"}
              />
            </div>
          </dd>
        </div>
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Monthly Consumed Fuel (Litre)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalMonthlyFuel ?? []}
                colors={{ scheme: "paired" }}
                legendFor={"Week Days"}
                legendType={"Amount(ETB)"}
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default FuelTrendDisplay;
