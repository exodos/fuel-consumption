import PaymentBySubsidy from "./payment-by-subsidy";
import TransactionBySubsidy from "./transaction-by-subsidy";

const DisplayMonthlyBySubsidy = ({
  totalMonthlyTransactionBySubsidy,
  totalMonthlyPaymentBySubsidy,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <TransactionBySubsidy
          transactionData={totalMonthlyTransactionBySubsidy}
          title={"Total Monthly Transaction With And With Out Subsidy (Count)"}
          colors={["stone", "pink"]}
          byIndex={"month"}
        />
        <PaymentBySubsidy
          paymentData={totalMonthlyPaymentBySubsidy}
          title={"Total Monthly Payment With And With Out Subsidy (Amount)"}
          colors={["amber", "indigo"]}
          byIndex={"month"}
        />
      </dl>
    </div>
  );
};

export default DisplayMonthlyBySubsidy;
