import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebase";
import "firebase/auth";
import Calendar from "react-calendar";
import DaySummary from "./DaySummary";
import {
  Button,
  Dialog,
  Grid,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import colors from "../assets/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import activityList from "../assets/activityList.json";
import CalendarIcon from "@material-ui/icons/TodayOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.stepitup_teal,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    background: colors.stepitup_teal,
    border: 0,
    borderRadius: 3,
    color: colors.almostWhite,
    height: 48,
    padding: "0 30px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    marginBottom: "20px",
    "& label.Mui-focused": {
      color: colors.almostBlack,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.stepitup_teal,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "max-content",
    justifyContent: "center",
  },
}));

const EditActivities = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const userId = props.userId;
  const [date, setDate] = useState("");
  const [datePrompt, setDatePrompt] = useState("Select date");
  const [duration, setDuration] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activity, setActivity] = useState();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dayTotalDuration, setDayTotalDuration] = useState(0);
  const [selectedDateContent, setSelectedDateContent] = useState();

  const handleClose = () => {
    setCalendarOpen(false);
  };

  function createActivityOption(activityOption) {
    if (activityOption !== undefined) {
      return <option value={activityOption[0]}>{activityOption[0]}</option>;
    }
  }

  function getDayActivities(day) {
    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("activities")
      .doc(day)
      .get()
      .then((retrievedDay) => {
        let data = retrievedDay.data();
        setSelectedDateContent(data);
        setDayTotalDuration(0);
        let total = 0;
        if (data) {
          Object.values(data).forEach((activityDuration) => {
            total += activityDuration;
          });
        }
        setDayTotalDuration(total);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        return [];
      });
  }

  function updateUserTotalDuration(updatedDuration, previousDuration) {
    let currentTotal;
    let updatedTotal;
    const docRef = firebase.firestore().collection("users").doc(userId);

    docRef
      .get()
      .then((retrievedUser) => {
        currentTotal = parseInt(retrievedUser.data().totalDuration);
        updatedTotal = currentTotal - previousDuration + updatedDuration;

        docRef
          .set(
            {
              totalDuration: updatedTotal,
            },
            { merge: true }
          )
          .then(function () {
            console.log("successfully updated user's total duration");
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
        return [];
      });
  }

  function recordActivity(date, activity, duration) {
    let oldDuration;
    if (selectedDateContent[activity]) {
      oldDuration = selectedDateContent[activity];
    } else {
      oldDuration = 0;
    }

    if (date !== "" || activity || duration) {
      const docRef = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("activities")
        .doc(date.toString());

      return docRef
        .set(
          {
            [activity]: duration,
          },
          { merge: true }
        )
        .then(function () {
          updateUserTotalDuration(duration, oldDuration);
          getDayActivities(selectedDate.toString());
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography style={{ color: "#f7f7f5" }} variant="h6">
          {children}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  return (
    <Grid
      container
      spacing={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <div
          style={{
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              backgroundColor: colors.stepitup_teal,
              padding: "15px",
              display: "flex",
              justifyContent: "center",
              borderTopLeftRadius: "3px",
              borderTopRightRadius: "3px",
            }}
          >
            <Typography variant="h6" style={{ color: colors.almostWhite }}>
              Add activity
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderBottomLeftRadius: "3px",
              borderBottomRightRadius: "3px",
              backgroundColor: colors.stepitup_blueishGray,
            }}
          >
            <FormControl required className={classes.formControl}>
              <InputLabel id="simple-select-required-label">
                Activity type
              </InputLabel>
              <Select
                native
                value={activity}
                onChange={(event) => {
                  setActivity(event.target.value);
                }}
                labelId="simple-select-required-label"
                id="simple-select-required"
              >
                <option aria-label="None" value="" />
                {Object.entries(activityList).map((activityOption) =>
                  createActivityOption(activityOption)
                )}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <FormControl
                required
                variant="outlined"
                className={classes.formControl}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setCalendarOpen(true)}
                  >
                    <CalendarIcon />
                  </IconButton>
                  <Typography>{datePrompt}</Typography>
                </div>
              </FormControl>
              <FormControl
                required
                variant="outlined"
                className={classes.formControl}
              >
                <TextField
                  className={classes.textInput}
                  style={{ width: "90%" }}
                  label="Enter duration (min)"
                  type="number"
                  inputProps={{ min: "0" }}
                  onChange={(event) => {
                    setDuration(parseInt(event.target.value));
                  }}
                />
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  style={{
                    marginBottom: "10px",
                    backgroundColor: colors.stepitup_teal,
                    color: colors.almostWhite,
                  }}
                  onClick={(e) => {
                    recordActivity(date, activity, duration);
                  }}
                  color="primary"
                >
                  <Typography>Save</Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Grid>

      {selectedDate !== "" && (
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DaySummary
              total={dayTotalDuration}
              content={selectedDateContent}
              selectedDate={selectedDate}
            />
          </div>
        </Grid>
      )}

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={calendarOpen}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.almostBlack,
          }}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Select a date
          </DialogTitle>
        </div>
        <div className={classes.calendar}>
          <Calendar
            onChange={(newDate) => {
              setDate(newDate);
              let dateChunks = newDate.toString().split(" ");
              let simpleDate =
                dateChunks[0] +
                " " +
                dateChunks[1] +
                " " +
                dateChunks[2] +
                " , " +
                dateChunks[3];
              setDatePrompt(simpleDate);
            }}
            value={date}
            onClickDay={(selectedDate) => {
              setSelectedDate(selectedDate);
              getDayActivities(selectedDate.toString());
              handleClose();
            }}
          />
        </div>
      </Dialog>
    </Grid>
  );
};

export default EditActivities;
