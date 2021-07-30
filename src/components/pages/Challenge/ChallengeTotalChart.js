import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Typography } from "@material-ui/core";

export default function ChallengeTotalChart(props) {
  const { logs, idToNameMappings } = props;
  const [data, setData] = useState({ keys: [], values: [] });

  useEffect(() => {
    if (logs && idToNameMappings) {
      setData(convertLogsToChartData(logs));
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
    const dataKeys = ["Day", "Test Duration"];
    const dataValues = [];

    logs.forEach((log, index) => {
      log.activities.forEach((activity) => {
        const dateSplits = activity.date.split(" ");
        dataValues.push([parseInt(dateSplits[2]), parseInt(activity.duration)]);
      });
    });
    return {
      keys: dataKeys,
      values: dataValues,
    };
  };

  return data.keys.length > 0 && data.values.length > 0 ? (
    <Chart
      width={"100%"}
      height={"400px"}
      chartType="Line"
      loader={<div>Loading Chart</div>}
      data={[data.keys, ...data.values]}
      options={{
        chart: {
          title: "Challenge Participant Daily Totals",
          subtitle: "in minutes",
        },
      }}
      rootProps={{ "data-testid": "3" }}
    />
  ) : (
    <Typography className="section-body-regular-size">
      No stats yet for this challenge
    </Typography>
  );
}
