import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import firebase from "../firebase";
import "firebase/auth";
import Calendar from "react-calendar";
import DaySteps from "./DaySteps";
import { Button, Grid, TextField } from "@material-ui/core";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    background: colors.almostWhite,
    border: 0,
    borderRadius: 3,
    color: colors.almostBlack,
    height: 48,
    padding: "0 30px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.stepitup_teal,
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  textInput: {
    marginBottom: "20px",
    "& label.Mui-focused": {
      color: colors.almostBlack,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.almostWhite,
    },
  },
}));

function onEditSteps(userId, date, steps) {
  if (date !== "") {
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("steps")
      .doc(date.toString());

    return docRef
      .set({
        steps: steps,
      })
      .then(function () {
        console.log("successfully added steps document");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function onEditDailyTotals(date, steps, dayStepCount) {
  if (date !== "") {
    const decrement = -1 * dayStepCount;

    const docRef = firebase
      .firestore()
      .collection("dailyTotals")
      .doc(date.toString());

    docRef
      .set(
        {
          totalSteps: firebase.firestore.FieldValue.increment(decrement),
        },
        { merge: true }
      )
      .then(function () {
        console.log("removed old day count from daily total steps");
      })
      .catch(function (error) {
        console.log(error);
      });

    return docRef
      .set(
        {
          totalSteps: firebase.firestore.FieldValue.increment(steps),
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully incremented daily total steps");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function calculateTotal(userId, docs, user) {
  let totalSteps = 0;

  docs.map((doc) => {
    totalSteps += doc.steps;
  });

  const docRef = firebase.firestore().collection("users").doc(userId);

  console.log(`updating user total steps: ${totalSteps}`);
  docRef
    .set(
      {
        totalSteps: totalSteps,
      },
      { merge: true }
    )
    .then(function () {
      console.log("successfully updated total steps");
    })
    .catch(function (error) {
      console.log(error);
    });
}

const SORT_OPTIONS = {
  STEPS_ASC: { column: "steps", direction: "asc" },
  STEPS_DESC: { column: "steps", direction: "desc" },
};

function useSteps(sortBy = "STEPS_DESC", userId, user) {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("steps")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSteps(docs);
        calculateTotal(userId, docs, user);
      });

    return () => unsubscribe();
  }, [sortBy, userId, user]);

  return steps;
}

function showStepCount(date) {}

function useUser(userId) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((snapshot) => {
        const doc = {
          ...snapshot.data(),
        };
        setUser(doc);
      });

    return () => unsubscribe();
  }, [userId]);

  return user;
}

const EditSteps = (props) => {
  const classes = useStyles();

  const [userId, setUserId] = useState(props.userId);
  const [date, setDate] = useState("");
  const [steps, setSteps] = useState(0);
  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const [selectedDate, setSelectedDate] = useState("");
  const user = useUser(userId);
  const savedSteps = useSteps(sortBy, userId, user);

  useEffect(() => {
    return () => {
      console.log("EditSteps UNMOUNTED");
    };
  }, []);

  let dayStepCount = "0";

  savedSteps.map((step) => {
    if (step.id === selectedDate.toString()) {
      dayStepCount = step.steps;
    }
  });

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div className={classes.calendar}>
          <Calendar
            onChange={(newDate) => setDate(newDate)}
            value={date}
            onClickDay={(selectedDate) => {
              showStepCount(selectedDate);
              setSelectedDate(selectedDate);
            }}
          />
        </div>
      </Grid>

      <Grid
        container
        spacing={6}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {selectedDate && (
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Paper className={classes.paper} style={{ width: "80%" }}>
                <TextField
                  className={classes.textInput}
                  label="enter # of steps"
                  type="number"
                  inputProps={{ min: "0" }}
                  onChange={(event) => {
                    setSteps(parseInt(event.target.value));
                  }}
                />

                <Button
                  onClick={(e) => {
                    onEditSteps(userId, date, steps);
                    onEditDailyTotals(date, steps, dayStepCount);
                  }}
                  className={classes.button}
                >
                  Update Steps
                </Button>
              </Paper>
            </div>
          </Grid>
        )}

        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper className={classes.paper} style={{ width: "80%" }}>
              <DaySteps
                totalDaySteps={dayStepCount}
                selectedDate={selectedDate}
              />
            </Paper>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditSteps;
