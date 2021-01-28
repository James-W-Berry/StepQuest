import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@material-ui/core";
import firebase from "../firebase";
import "firebase/auth";
import moment from "moment";
import colors from "../assets/colors";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#E7E5DF40",
    border: 0,
    borderRadius: 3,
    color: colors.almostWhite,
    height: 48,
    padding: "0 30px",
  },
  lightTextHeading: {
    color: colors.almostWhite,
    fontSize: "1.25rem",
    fontWeight: "500",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
});

const SORT_OPTIONS = {
  DURATION_ASC: { column: "totalDuration", direction: "asc" },
  DURATION_DESC: { column: "totalDuration", direction: "desc" },
};

function useDailyTotals(sortBy = "DURATION_DESC") {
  const [dailyTotals, setDailyTotals] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("dailyTotals")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .get()
      .then((totals) => {
        const docs = totals.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDailyTotals(docs);
      });
  }, []);

  return dailyTotals;
}

function createData(day, steps) {
  return { day, steps };
}

function generateDailyTotals(dailyTotals) {
  let data = [];

  dailyTotals.forEach((day) => {
    const formattedDay = moment(day.id).format("MMM D");
    const checkForDate = checkIfDateIsPresent(data, formattedDay);
    if (checkForDate.isPresent) {
      // add to existing day
      data[checkForDate.index].steps += day.totalSteps;
    } else {
      // add new day
      data.push(createData(formattedDay, day.totalSteps));
    }
  });

  return data;
}

function checkIfDateIsPresent(data, date) {
  let result = {
    isPresent: false,
    index: 0,
  };

  data.forEach((value, index, array) => {
    if (data[index].day === date) {
      result.isPresent = true;
      result.index = index;
    }
  });

  return result;
}

function applyRangeFilter(dailyTotals, startDate, endDate) {
  let startEpoch = new Date(startDate).getTime();
  let endEpoch = new Date(endDate).getTime();

  let filteredDocs = [];

  dailyTotals.map((doc) => {
    let docDate = new Date(doc.id).getTime();

    if (docDate >= startEpoch && docDate <= endEpoch) {
      doc.epoch = docDate;
      filteredDocs.push(doc);
    }
  });

  filteredDocs.sort((a, b) => (a.epoch > b.epoch ? 1 : -1));

  return filteredDocs;
}

const CustomInput = ({ value, onClick, classes }) => (
  <Button className={classes.root} onClick={onClick}>
    {value}
  </Button>
);

export default function Chart(props) {
  const theme = useTheme();
  const classes = useStyles();

  let start = new Date();
  start.setMonth(start.getMonth() - 1);
  start.setHours(0, 0, 0);
  start.setMilliseconds(0);

  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(new Date());
  const sortBy = "DURATION_DESC";

  const dailyTotals = useDailyTotals(sortBy);
  const filteredDailyTotals = applyRangeFilter(dailyTotals, startDate, endDate);

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography h1 className={classes.lightTextHeading}>
            {props.title}
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "100px",
            }}
          >
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              customInput={<CustomInput classes={classes} />}
            />
            <Typography className={classes.lightTextHeading}> - </Typography>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<CustomInput classes={classes} />}
            />
          </div>
        </div>
      </div>

      <ResponsiveContainer>
        <LineChart
          data={generateDailyTotals(filteredDailyTotals)}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}></YAxis>
          <Line
            type="monotone"
            dataKey="steps"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
