import dynamic from "next/dynamic";
const TotalTransactionSource = dynamic(
  () => import("@/dashboard/total-transaction-source"),
  {
    ssr: false,
  }
);

const DisplaySourceData = ({
  totalTransactionBySourcePie,
  totalPaymentBySourcePie,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Transaction By Source (Count)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <TotalTransactionSource
                data={totalTransactionBySourcePie}
                colors={[
                  "#8DC63F",
                  "#188ECE",
                  "#FFC20E",
                  "#d3d3d3",
                  "#000000",
                  "#0a73b7",
                  "#e92028",
                ]}
              />
            </div>
          </dd>
        </div>
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">
            Total Payment By Source (ETB)
          </dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <TotalTransactionSource
                data={totalPaymentBySourcePie}
                colors={["#FFC20E", "#0a73b7", "#e92028"]}
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default DisplaySourceData;
