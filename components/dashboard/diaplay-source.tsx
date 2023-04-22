import dynamic from "next/dynamic";
import TransactionDonatChart from "./source-transaction";
const TotalTransactionSource = dynamic(
  () => import("@/dashboard/total-transaction-source"),
  {
    ssr: false,
  }
);

const DisplaySource = ({
  totalTransactionBySourcePie,
  totalPaymentBySourcePie,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <TransactionDonatChart
          data={totalTransactionBySourcePie}
          textHeader="Total Transaction By Source (Count)"
          colors={["blue", "green", "yellow", "slate", "violet", "indigo"]}
        />
        <TransactionDonatChart
          data={totalPaymentBySourcePie}
          textHeader="Total Payment By Source (ETB)"
          colors={["rose", "cyan", "amber", "blue", "green", "yellow"]}
        />
      </dl>
    </div>
  );
};

export default DisplaySource;
