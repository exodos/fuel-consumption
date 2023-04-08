import { LineChartBySource } from "./linechart-by-source";
const DisplayWeeklyDashBoard = ({
  totalWeeklyTransaction,
  totalWeeklyPayment,
  totalWeeklyFuel,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-1">
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">Transaction (Count)</dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <LineChartBySource
                data={totalWeeklyTransaction ?? []}
                colors={{ scheme: "set1" }}
                legendFor={"Weekly"}
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
                data={totalWeeklyPayment ?? []}
                colors={{ scheme: "set2" }}
                legendFor={"Weekly"}
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
                data={totalWeeklyFuel ?? []}
                colors={{ scheme: "paired" }}
                legendFor={"Weekly"}
                legendType={"Litre"}
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default DisplayWeeklyDashBoard;
