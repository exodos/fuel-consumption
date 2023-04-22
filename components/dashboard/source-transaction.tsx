import { Card, Title, DonutChart, Legend } from "@tremor/react";
import { useState } from "react";

const valueFormatter = (number: number) =>
  ` ${Intl.NumberFormat("us").format(number).toString()}`;

const TransactionDonatChart = ({ data, textHeader, colors }) => (
  <Card className="relative border bg-white border-gray-300 rounded-xl p-10">
    <Title>{textHeader}</Title>
    <DonutChart
      className="mt-6 w-full h-[350px]"
      data={data}
      category={"value"}
      index={"label"}
      valueFormatter={valueFormatter}
      colors={colors}
    />
    <Legend
      className="mt-3 justify-center translate-x-0 translate-y-5 space-x-6"
      categories={data.map((item) => item.label)}
      colors={colors}
    />
  </Card>
);

export default TransactionDonatChart;
