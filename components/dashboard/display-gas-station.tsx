import dynamic from "next/dynamic";
const RegionalAmountTrend = dynamic(
  () => import("@/dashboard/regional-amont-trend"),
  {
    ssr: false,
  }
);

const RegionalPercentageTrend = dynamic(
  () => import("@/dashboard/regional-percentae")
);

const DisplayGasStationData = ({ gasStationAmount, gasStationFuel }) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Transaction Amount (ETB)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <RegionalPercentageTrend
                data={gasStationAmount}
                colors={{ scheme: "category10" }}
              />
            </div>
          </dd>
        </div>
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Transaction Fuel (LITRE)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <RegionalPercentageTrend
                data={gasStationFuel}
                colors={{ scheme: "accent" }}
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default DisplayGasStationData;
