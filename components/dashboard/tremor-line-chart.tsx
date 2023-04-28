import { Card, Title, LineChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us")
    .format(number / 1000000)
    .toString()}M`;
const TremorLineChart = ({ totalDailyTransactionWithSubsidy }) => {
  return (
    <Card>
      <Title>Total Daily Transaction With Subsidy (Count)</Title>
      <LineChart
        className="mt-10"
        data={totalDailyTransactionWithSubsidy}
        index="day"
        categories={["Total Daily Transaction"]}
        colors={["blue"]}
        valueFormatter={dataFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default TremorLineChart;
