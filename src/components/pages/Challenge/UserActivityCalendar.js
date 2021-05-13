import { Button, Dialog, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Calender from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addActivityEntries, getUserEntries } from "../../../api/challengeApi";
import colors from "../../../assets/colors";
import DayActivitiesDialog from "./DayActivitiesDialog";

export default function UserActivityCalendar(props) {
  const { user, challenge, startDate, endDate } = props;
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userEntries, setUserEntries] = useState([]);
  const [newLogEntries, setNewLogEntries] = useState([]);
  const [isDayActivitiesDialogVisible, setIsDayActivitiesDialogVisible] =
    useState(false);

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
        setNewLogEntries(response.data);
      } else {
        console.log(response.message);
      }
    });
  }, []);

  useEffect(() => {
    console.log(newLogEntries);
  }, [newLogEntries]);

  return (
    <div>
      <Calender
        minDate={minDate}
        maxDate={maxDate}
        value={selectedDate}
        style={{}}
        tileContent={({ activeStartDate, date, view }) => {
          const daysWithActivities = userEntries.filter(
            (entry) => entry.date === date.toString()
          );
          if (daysWithActivities.length > 0) {
            return daysWithActivities.map((day, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: "100%",
                    margin: "4px",
                    padding: "4px",
                    backgroundColor: colors.stepitup_blue,
                    borderRadius: "4px",
                    color: colors.white,
                  }}
                >
                  <Typography>
                    {day.activity} - {day.duration}min
                  </Typography>
                </div>
              );
            });
          }
        }}
        onClickDay={(value) => {
          setSelectedDate(value);
          setIsDayActivitiesDialogVisible(!isDayActivitiesDialogVisible);
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
      <DayActivitiesDialog
        isOpen={isDayActivitiesDialogVisible}
        day={selectedDate}
        activities={newLogEntries.filter((entry) => {
          return entry.date === selectedDate.toString();
        })}
        setActivities={setNewLogEntries}
        setDialogVisible={setIsDayActivitiesDialogVisible}
      />
    </div>
  );
}
