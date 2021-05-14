import { ResponsiveLine } from "@nivo/line";

export default function ChallengeTotalChart() {
  const data = [
    {
      id: "user 1",
      color: "hsl(167, 70%, 50%)",
      data: [
        {
          x: "day 1",
          y: 33,
        },
        {
          x: "day 2",
          y: 226,
        },
        {
          x: "day 3",
          y: 198,
        },
        {
          x: "day 4",
          y: 137,
        },
        {
          x: "day 5",
          y: 94,
        },
        {
          x: "day 6",
          y: 44,
        },
        {
          x: "day 7",
          y: 23,
        },
        {
          x: "day 8",
          y: 106,
        },
        {
          x: "day 9",
          y: 131,
        },
        {
          x: "day 10",
          y: 137,
        },
        {
          x: "day 11",
          y: 11,
        },
        {
          x: "day 12",
          y: 164,
        },
      ],
    },
    {
      id: "user 2",
      color: "hsl(85, 70%, 50%)",
      data: [
        {
          x: "day 1",
          y: 94,
        },
        {
          x: "day 2",
          y: 71,
        },
        {
          x: "day 3",
          y: 198,
        },
        {
          x: "day 4",
          y: 40,
        },
        {
          x: "day 5",
          y: 154,
        },
        {
          x: "day 6",
          y: 237,
        },
        {
          x: "day 7",
          y: 165,
        },
        {
          x: "day 8",
          y: 173,
        },
        {
          x: "day 9",
          y: 88,
        },
        {
          x: "day 10",
          y: 234,
        },
        {
          x: "day 11",
          y: 118,
        },
        {
          x: "day 12",
          y: 128,
        },
      ],
    },
    {
      id: "user 3",
      color: "hsl(266, 70%, 50%)",
      data: [
        {
          x: "day 1",
          y: 21,
        },
        {
          x: "day 2",
          y: 65,
        },
        {
          x: "day 3",
          y: 291,
        },
        {
          x: "day 4",
          y: 169,
        },
        {
          x: "day 5",
          y: 282,
        },
        {
          x: "day 6",
          y: 300,
        },
        {
          x: "day 7",
          y: 242,
        },
        {
          x: "day 8",
          y: 254,
        },
        {
          x: "day 9",
          y: 198,
        },
        {
          x: "day 10",
          y: 291,
        },
        {
          x: "day 11",
          y: 40,
        },
        {
          x: "day 12",
          y: 113,
        },
      ],
    },
    {
      id: "user 4",
      color: "hsl(351, 70%, 50%)",
      data: [
        {
          x: "day 1",
          y: 9,
        },
        {
          x: "day 2",
          y: 144,
        },
        {
          x: "day 3",
          y: 195,
        },
        {
          x: "day 4",
          y: 22,
        },
        {
          x: "day 5",
          y: 91,
        },
        {
          x: "day 6",
          y: 237,
        },
        {
          x: "day 7",
          y: 87,
        },
        {
          x: "day 8",
          y: 209,
        },
        {
          x: "day 9",
          y: 205,
        },
        {
          x: "day 10",
          y: 223,
        },
        {
          x: "day 11",
          y: 24,
        },
        {
          x: "day 12",
          y: 37,
        },
      ],
    },
    {
      id: "user 5",
      color: "hsl(85, 70%, 50%)",
      data: [
        {
          x: "day 1",
          y: 51,
        },
        {
          x: "day 2",
          y: 264,
        },
        {
          x: "day 3",
          y: 27,
        },
        {
          x: "day 4",
          y: 124,
        },
        {
          x: "day 5",
          y: 84,
        },
        {
          x: "day 6",
          y: 257,
        },
        {
          x: "day 7",
          y: 276,
        },
        {
          x: "day 8",
          y: 278,
        },
        {
          x: "day 9",
          y: 295,
        },
        {
          x: "day 10",
          y: 226,
        },
        {
          x: "day 11",
          y: 61,
        },
        {
          x: "day 12",
          y: 272,
        },
      ],
    },
  ];

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Challenge Day",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Challenge Unit (time, miles, count, etc)",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      colors={{ scheme: "paired" }}
      enablePoints={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      enableArea={true}
      areaBlendMode="darken"
      areaBaselineValue={60}
      areaOpacity={0.3}
      useMesh={true}
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
    />
  );
}
