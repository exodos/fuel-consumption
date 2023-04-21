import { LineChartBySource } from "./linechart-by-source";

const DisplayDailyDashBoard = ({
  totalDailyTransaction,
  totalDailyPayment,
  totalDailyFuel,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">Transaction (Count)</dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalDailyTransaction ?? []}
                colors={{ scheme: "dark2" }}
                legendFor={"Week Days"}
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
                data={totalDailyPayment ?? []}
                colors={{ scheme: "accent" }}
                legendFor={"Week Days"}
                legendType={"Amount(ETB)"}
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
                data={totalDailyFuel ?? []}
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

export default DisplayDailyDashBoard;
