import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from "recharts";
import Title from "./Title";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@material-ui/core";
import firebase from "../firebase";
import "firebase/auth";
import moment from "moment";

const useStyles = makeStyles({
  textInput: {
    width: "20vw",
    "& label.Mui-focused": {
      color: "#171820"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#171820"
    }
  },
  root: {
    backgroundColor: "#E7E5DF40",
    border: 0,
    borderRadius: 3,
    color: "#171820",
    height: 48,
    padding: "0 30px"
  }
});

const SORT_OPTIONS = {
  STEPS_ASC: { column: "totalSteps", direction: "asc" },
  STEPS_DESC: { column: "totalSteps", direction: "desc" }
};

function useDailyTotals(sortBy = "STEPS_DESC") {
  const [dailyTotals, setDailyTotals] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("dailyTotals")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot(snapshot => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDailyTotals(docs);
      });

    return () => unsubscribe();
  }, []);

  return dailyTotals;
}

function createData(day, steps) {
  return { day, steps };
}

function generateDailyTotals(dailyTotals) {
  let data = [];

  dailyTotals.map(day => {
    const formattedDay = moment(day.id).format("MMM D");
    data.push(createData(formattedDay, day.totalSteps));
  });

  return data;
}

function applyRangeFilter(dailyTotals, startDate, endDate) {
  let startEpoch = new Date(startDate).getTime();
  let endEpoch = new Date(endDate).getTime();

  let filteredDocs = [];

  dailyTotals.map(doc => {
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

export default function Chart() {
  const theme = useTheme();
  const classes = useStyles();

  let start = new Date();
  start.setMonth(start.getMonth() - 1);
  start.setHours(0, 0, 0);
  start.setMilliseconds(0);

  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(new Date());
  const [sortBy, setSortBy] = useState("STEPS_DESC");

  const dailyTotals = useDailyTotals(sortBy);
  const filteredDailyTotals = applyRangeFilter(dailyTotals, startDate, endDate);

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Title>Daily Group Step Total</Title>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "100px"
            }}
          >
            <DatePicker
              selected={startDate}
              onChange={date => {
                setStartDate(date);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              customInput={<CustomInput classes={classes} />}
            />
            <Title style={{ marginLeft: "100px" }}> - </Title>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
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
            left: 24
          }}
        >
          <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Steps
            </Label>
          </YAxis>
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
