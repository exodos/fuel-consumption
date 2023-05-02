import PaymentBySubsidy from "./payment-by-subsidy";
import TransactionBySubsidy from "./transaction-by-subsidy";

const DisplayWeeklyBySubsidy = ({
  totalWeeklyTransactionBySubsidy,
  totalWeeklyPaymentBySubsidy,
}) => {
  return (
    <div>
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-1 lg:max-w-none lg:grid-cols-2">
        <TransactionBySubsidy
          transactionData={totalWeeklyTransactionBySubsidy}
          title={"Total Weekly Transaction With And With Out Subsidy (Count)"}
          colors={["violet", "cyan"]}
          byIndex={"week"}
        />
        <PaymentBySubsidy
          paymentData={totalWeeklyPaymentBySubsidy}
          title={"Total Weekly Payment With And With Out Subsidy (Amount)"}
          colors={["emerald", "rose"]}
          byIndex={"week"}
        />
      </dl>
    </div>
  );
};

export default DisplayWeeklyBySubsidy;
