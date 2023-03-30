import { ResponsiveLine } from "@nivo/line";

export const PaymentTrend = ({ data, colors, legend }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 40, right: 60, bottom: 60, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    colors={colors}
    yFormat=" >-,.2f"
    curve="linear"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: legend,
      legendOffset: 36,
      legendPosition: "middle",
    }}
    axisLeft={{
      tickValues: 9,
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      format: ".2s",
      legend: "Amount(ETB)",
      legendOffset: -50,
      legendPosition: "middle",
    }}
    enableGridX={false}
    pointSize={4}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    enableArea={false}
    crosshairType="bottom"
    useMesh={true}
  />
);
