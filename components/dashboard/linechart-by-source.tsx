import { ResponsiveLine } from "@nivo/line";

export const LineChartBySource = ({ data, colors, legendFor, legendType }) => {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 40, right: 110, bottom: 60, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-,.2f"
      curve="cardinal"
      // curve="linear"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: legendFor,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: ".2s",
        legend: legendType,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      colors={colors}
      pointSize={4}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel={function (t) {
        return t.x + ": " + t.y;
      }}
      pointLabelYOffset={-12}
      enableArea={false}
      useMesh={true}
      tooltip={({ point }) => {
        return (
          <div className="text-base bg-lightGreen p-5">
            <div>
              x:{" "}
              <span className="text text-base font-semibold">
                {`${point.id}`.slice(0, -2)}
              </span>
            </div>
            <div>
              y:{" "}
              <span className="text text-base font-semibold">
                {/* {`${point.data.y}`} */}
                {`${point.data.y.toLocaleString()}`}
              </span>
            </div>
          </div>
        );
      }}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
      // motionConfig="default"
    />
  );
};
