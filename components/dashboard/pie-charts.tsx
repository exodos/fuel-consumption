import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const RegionPieChart = ({ amountMapping, fuelMapping }) => {
  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <PieChart width={400} height={400}>
        <Pie
          data={amountMapping}
          dataKey="amountValue"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          //   label={({
          //     cx,
          //     cy,
          //     midAngle,
          //     innerRadius,
          //     outerRadius,
          //     percent,
          //     index,
          //   }) => {
          //     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          //     const x = cx + radius * Math.cos(-midAngle * RADIAN);
          //     const y = cy + radius * Math.sin(-midAngle * RADIAN);

          //     return (
          //       <text
          //         x={x}
          //         y={y}
          //         fill="white"
          //         textAnchor={x > cx ? "start" : "end"}
          //         dominantBaseline="central"
          //       >
          //         {amountMapping[index].regionName}({"amountValue"})
          //       </text>
          //     );
          //   }}
          outerRadius={60}
          fill="#8884d8"
        >
          {amountMapping.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          data={fuelMapping}
          dataKey="fuelValue"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#82ca9d"
          //   label
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
          }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="black"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {fuelMapping[index].regionName}({"fuelValue"})
              </text>
            );
          }}
        >
          {/* {fuelMapping.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))} */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RegionPieChart;
