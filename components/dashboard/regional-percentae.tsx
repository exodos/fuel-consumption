import { ResponsivePie } from "@nivo/pie";

const RegionalPercentageTrend = ({ data, colors }) => (
  <ResponsivePie
    data={data ?? []}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    // valueFormat=" >-0,.2f"
    valueFormat={(value) => `${value}%`}
    innerRadius={0.6}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    colors={colors ?? []}
    borderWidth={1}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.2]],
    }}
    // sliceLabel={(item) => `${item.value}%`}
    // sliceLabel={sliceLabel}
    animate={false}
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
    arcLinkLabelsSkipAngle={10}
    // arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
    arcLabelsRadiusOffset={0.7}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
  />
);

export default RegionalPercentageTrend;
