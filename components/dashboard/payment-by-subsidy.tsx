import { Card, Title, LineChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us")
    .format(number / 1000000)
    .toString()}M`;
const PaymentBySubsidy = ({ totalDailyPaymentBySubsidy, title, colors }) => {
  return (
    <Card className="relative border bg-white border-gray-300 rounded-xl p-10">
      <Title>{title}</Title>
      <LineChart
        className="mt-8"
        data={totalDailyPaymentBySubsidy}
        index="day"
        categories={["With Subsidy", "With Out Subsidy"]}
        // colors={["green", "blue"]}
        colors={colors}
        valueFormatter={dataFormatter}
        // showLegend={false}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default PaymentBySubsidy;
