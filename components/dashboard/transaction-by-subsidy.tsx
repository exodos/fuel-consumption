import { Card, Title, LineChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us")
    .format(number / 1000000)
    .toString()}M`;
const TransactionBySubsidy = ({ totalDailyTransactionBySubsidy }) => {
  return (
    <Card className="relative border bg-white border-gray-300 rounded-xl p-10">
      {/* <Flex className="space-x-4" justifyContent="start" alignItems="center"> */}
      <Title>Total Daily Transaction With And With Out Subsidy (Count)</Title>
      <LineChart
        className="mt-8"
        data={totalDailyTransactionBySubsidy}
        index="day"
        categories={["With Subsidy", "With Out Subsidy"]}
        colors={["indigo", "fuchsia"]}
        valueFormatter={dataFormatter}
        // showLegend={false}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default TransactionBySubsidy;
