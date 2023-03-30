import { PaymentTrend } from "./payement-trend";
import { TransactionTrend } from "./transaction-trend.";

const DisplayDailyDashBoard = ({
  totalDailyTransaction,
  totalDailyPayment,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <div className="border bg-white border-gray-300 rounded-xl p-10">
          <dt className="text-gray-500 text-center">Transaction (Count)</dt>
          <dd className="mt-5 text-lg text-center">
            <div className="w-full h-[400px]">
              <TransactionTrend
                data={totalDailyTransaction ?? []}
                colors="#8DC63F"
                legend={"Daily"}
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
              <PaymentTrend
                data={totalDailyPayment ?? []}
                colors="#8DC63F"
                legend={"Daily"}
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default DisplayDailyDashBoard;
