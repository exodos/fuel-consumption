import { ResponsivePie } from "@nivo/pie";

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  let total = 0;
  dataWithArc.forEach((element) => {
    total += element.value;
  });
  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {total.toLocaleString()}
    </text>
  );
};
const TotalTransactionSource = ({ data, colors }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    valueFormat=" >-0,~f"
    innerRadius={0.8}
    enableArcLabels={false}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
    colors={colors}
    borderWidth={1}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.2]],
    }}
    animate={true}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
    // arcLabelsRadiusOffset={0.7}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
  />
);

export default TotalTransactionSource;
