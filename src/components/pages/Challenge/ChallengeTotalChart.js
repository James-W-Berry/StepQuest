import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import colors from "../../../assets/colors";

export default function ChallengeTotalChart(props) {
  const { logs, idToNameMappings } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (logs && idToNameMappings) {
      setData(convertLogsToChartData(logs));
      console.log(convertLogsToChartData(logs));
    }
  }, [logs, idToNameMappings]);

  const convertActivitiesToChartData = (activities) => {
    return activities.map((activity) => {
      const dateSplits = activity.date.split(" ");
      return {
        x: `${dateSplits[1]} ${dateSplits[2]}`,
        y: parseInt(activity.duration),
      };
    });
  };

  const convertLogsToChartData = (logs) => {
    return logs.map((log, index) => {
      return {
        id: idToNameMappings[log.participant],
        color: index > 1 ? "hsl(167, 70%, 50%)" : "hsl(85, 70%, 50%)",
        data: convertActivitiesToChartData(log.activities),
      };
    });
  };

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
        legend: "Day",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Duration",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
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
