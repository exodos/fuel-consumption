import FuelBySubsidy from "./fuel-by-subsidy";
import PaymentBySubsidy from "./payment-by-subsidy";
import TransactionBySubsidy from "./transaction-by-subsidy";

const DisplayDailyWithSubsidy = ({
  totalDailyTransactionBySubsidy,
  totalDailyPaymentBySubsidy,
  totalDailyFuelBySubsidy,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <TransactionBySubsidy
          totalDailyTransactionBySubsidy={totalDailyTransactionBySubsidy}
        />
        <PaymentBySubsidy
          totalDailyPaymentBySubsidy={totalDailyPaymentBySubsidy}
          title={"Total Daily Payment With And With Out Subsidy (Amount)"}
          colors={["green", "yellow"]}
        />
        <FuelBySubsidy
          totalDailyFuelBySubsidy={totalDailyFuelBySubsidy}
          title={"Total Daily Fuel With And With Out Subsidy (Litre)"}
          colors={["yellow-orange", "red"]}
        />
      </dl>
    </div>
  );
};

export default DisplayDailyWithSubsidy;
