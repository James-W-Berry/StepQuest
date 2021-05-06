import { Button, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Calender from "react-calendar";
import { addActivityEntries, getUserEntries } from "../../../api/challengeApi";
import colors from "../../../assets/colors";

const testData = [
  {
    date: "Thu May 20 2021 00:00:00 GMT-0400 (Eastern Daylight Time)",
    activity: "Weightlifting",
    duration: "60",
  },

  {
    date: "Thu May 20 2021 00:00:00 GMT-0400 (Eastern Daylight Time)",
    activity: "Swimming",
    duration: "60",
  },

  {
    date: "Fri May 21 2021 00:00:00 GMT-0400 (Eastern Daylight Time)",
    activity: "Running",
    duration: "30",
  },
];

export default function UserActivityCalendar(props) {
  const { user, challenge, startDate, endDate } = props;
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userEntries, setUserEntries] = useState([]);
  const [newLogEntries, setNewLogEntries] = useState(testData);

  useEffect(() => {
    const start = new Date(1970, 0, 1);
    start.setSeconds(startDate);
    setMinDate(start);
  }, [startDate]);

  useEffect(() => {
    const end = new Date(1970, 0, 1);
    end.setSeconds(endDate);
    setMaxDate(end);
  }, [endDate]);

  useEffect(() => {
    getUserEntries(challenge, user).then((response) => {
      if (response.success) {
        setUserEntries(response.data);
      } else {
        console.log(response.message);
      }
    });
  }, []);

  return (
    <div>
      <Calender
        minDate={minDate}
        maxDate={maxDate}
        value={selectedDate}
        tileContent={({ activeStartDate, date, view }) => {
          const activeDate = userEntries.find(
            (entry) => entry.date === date.toString()
          );
          if (activeDate) {
            return (
              <div
                style={{
                  padding: "4px",
                  backgroundColor: colors.stepitup_blue,
                  borderRadius: "4px",
                  color: colors.white,
                }}
              >
                <Typography>
                  {activeDate.activity} - {activeDate.duration}min
                </Typography>
              </div>
            );
          }
        }}
        onClickDay={(value) => {
          console.log(value);
          setSelectedDate(value);
        }}
      />
      <Button
        style={{
          backgroundColor: colors.stepitup_blue,
          color: colors.white,
        }}
        onClick={() =>
          addActivityEntries(challenge, user, newLogEntries).then(
            (response) => {
              console.log(response);
            }
          )
        }
      >
        Save
      </Button>
    </div>
  );
}
