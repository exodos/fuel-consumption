import { FuelChart } from "./fuel-trend";
import { LineChartBySource } from "./linechart-by-source";
import { PaymentTrend } from "./payement-trend";
import RegionPieChart from "./pie-charts";
import { TransactionTrend } from "./transaction-trend.";

const DisplayMonthlyDashBoard = ({
  totalMonthlyTransaction,
  totalMonthlyPayment,
  totalMonthlyFuel,
  amountMapping,
  fuelMapping,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">Transaction (Count)</dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalMonthlyTransaction ?? []}
                colors={{ scheme: "dark2" }}
                legendFor={"Monthly"}
                legendType={"Count"}
              />
            </div>
          </dd>
        </div>
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Transaction Amount (ETB)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalMonthlyPayment ?? []}
                colors={{ scheme: "accent" }}
                // colors={["#9370DB", "#1E90FF", "#FF4500"]}
                legendFor={"Monthly"}
                legendType={"Amount (ETB)"}
              />
            </div>
          </dd>
        </div>
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Consumed Fuel (Litre)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalMonthlyFuel ?? []}
                colors={["#8B4513", "#1E90FF", "#FF00FF"]}
                // colors={{ scheme: "paired" }}
                legendFor={"Monthly"}
                legendType={"Litre"}
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default DisplayMonthlyDashBoard;
