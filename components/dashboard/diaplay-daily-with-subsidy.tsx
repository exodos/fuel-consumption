import FuelBySubsidy from "./fuel-by-subsidy";
import PaymentBySubsidy from "./payment-by-subsidy";
import TransactionBySubsidy from "./transaction-by-subsidy";

const DisplayDailyWithSubsidy = ({
  totalDailyTransactionBySubsidy,
  totalDailyPaymentBySubsidy,
  // totalDailyFuelBySubsidy,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <TransactionBySubsidy
          transactionData={totalDailyTransactionBySubsidy}
          title={"Total Daily Transaction With And With Out Subsidy (Count)"}
          colors={["indigo", "fuchsia"]}
          byIndex={"day"}
        />
        <PaymentBySubsidy
          paymentData={totalDailyPaymentBySubsidy}
          title={"Total Daily Payment With And With Out Subsidy (Amount)"}
          colors={["yellow", "lime"]}
          byIndex={"day"}
        />
      </dl>
    </div>
  );
};

export default DisplayDailyWithSubsidy;
