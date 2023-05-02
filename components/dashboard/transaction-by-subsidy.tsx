import { Card, Title, LineChart } from "@tremor/react";

const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};
const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us", options)
    .format(number / 1000)
    .toString()}K`;
const TransactionBySubsidy = ({ transactionData, title, colors, byIndex }) => {
  return (
    <Card className="relative border bg-white border-gray-300 rounded-xl p-10">
      <Title>{title}</Title>
      <LineChart
        className="mt-8"
        data={transactionData}
        index={byIndex}
        categories={["With Subsidy", "With Out Subsidy"]}
        colors={colors}
        valueFormatter={dataFormatter}
        // showLegend={false}
        yAxisWidth={40}
        curveType="natural"
      />
    </Card>
  );
};

export default TransactionBySubsidy;
