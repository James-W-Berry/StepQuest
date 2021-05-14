import { Button, IconButton, Snackbar, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { isEqual } from "lodash";
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
  const [origLogEntries, setOrigLogEntries] = useState([]);
  const [logEntries, setLogEntries] = useState([]);
  const [isDayActivitiesDialogVisible, setIsDayActivitiesDialogVisible] =
    useState(false);
  const [displayToast, setDisplayToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();

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
        setOrigLogEntries(response.data);
        setLogEntries(response.data);
      } else {
        console.log(response.message);
      }
    });
  }, []);

  const updateLogEntries = (day, entries) => {
    const updated = logEntries
      .filter((entry) => entry.date !== day)
      .concat(entries);
    console.log(updated);
    setLogEntries(updated);
  };

  return (
    <div>
      <Calender
        minDate={minDate}
        maxDate={maxDate}
        value={selectedDate}
        style={{}}
        tileContent={({ activeStartDate, date, view }) => {
          const daysWithActivities = logEntries.filter(
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
          backgroundColor: isEqual(logEntries, origLogEntries)
            ? colors.stepitup_fadedBlue
            : colors.stepitup_blue,
          color: colors.white,
          margin: "10px",
        }}
        disabled={isEqual(logEntries, origLogEntries)}
        onClick={() =>
          addActivityEntries(challenge, user, logEntries).then((response) => {
            if (response.success) {
              setToastMessage("Successfully logged activities!");
              setDisplayToast(true);
            } else {
              setToastMessage(
                "Failed to log activities! Please try again later."
              );
              setDisplayToast(true);
            }
          })
        }
      >
        Save
      </Button>

      <DayActivitiesDialog
        isOpen={isDayActivitiesDialogVisible}
        day={selectedDate}
        activities={logEntries.filter((entry) => {
          return entry.date === selectedDate.toString();
        })}
        updateActivities={updateLogEntries}
        setDialogVisible={setIsDayActivitiesDialogVisible}
      />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={displayToast}
        autoHideDuration={5000}
        onClose={() => setDisplayToast(false)}
        message={toastMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setDisplayToast(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
