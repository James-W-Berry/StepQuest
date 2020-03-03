import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TotalSteps from "./TotalSteps";
import Title from "./Title";
import moment from "moment";
import AverageSteps from "./AverageSteps";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 240
  },
  root: {
    color: "#E7E5DF"
  },
  select: {
    "&:before": {
      borderColor: "#fdc029"
    },
    "&:after": {
      borderColor: "#fdc029"
    }
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  button: {
    "&:hover": {
      backgroundColor: "#fdc029",
      color: "#171820"
    },
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 48,
    padding: "0 30px"
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E7E5DF",
    fixedHeight: 240,
    maxWidth: 300,
    justifyContent: "center",
    alignItems: "center"
  }
}));

const SORT_OPTIONS = {
  STEPS_ASC: { column: "totalSteps", direction: "asc" },
  STEPS_DESC: { column: "totalSteps", direction: "desc" }
};

function useUsers(sortBy = "STEPS_DESC") {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot(snapshot => {
        const newUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(newUsers);
      });

    return () => unsubscribe();
  }, [sortBy]);

  return users;
}

async function calculateDailyTotals(user) {
  let response = await firebase
    .firestore()
    .collection("users")
    .doc(user.id)
    .collection("steps")
    .orderBy("steps", "desc")
    .limit(5)
    .get()
    .then(function(docs) {
      const userSteps = docs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return userSteps;
    });
  return response;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function UserList() {
  const classes = useStyles();
  const selectStyle = clsx(classes.root, classes.select);

  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const [selectedStepper, setSelectedStepper] = useState("");
  const [userDailyTotals, setUserDailyTotals] = useState([]);

  const users = useUsers(sortBy);

  const handleFilterChange = event => {
    setSortBy(event.target.value);
  };

  async function handleStepperClicked(user) {
    setSelectedStepper(user);
    let totals = await calculateDailyTotals(user);
    setUserDailyTotals(totals);
  }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 2,
          borderRightWidth: "1px",
          borderRightColor: "#171820"
        }}
      >
        <h1>Stepper Ranking</h1>
        <FormControl className={classes.formControl}>
          <InputLabel id="sortSelectLabel" style={{ color: "#E7E5DF" }}>
            Sort By
          </InputLabel>
          <Select
            className={selectStyle}
            labelId="sortSelectLabel"
            id="sortSelect"
            value={sortBy}
            onChange={handleFilterChange}
          >
            <MenuItem value={"STEPS_DESC"}>Steps (most first)</MenuItem>
            <MenuItem value={"STEPS_ASC"}>Steps (least first)</MenuItem>
          </Select>
        </FormControl>
        <ol>
          {users.map(user => (
            <li key={user.id}>
              <div>
                <Button
                  className={classes.button}
                  onClick={() => handleStepperClicked(user)}
                >
                  {`${user.displayName} - ${numberWithCommas(
                    user.totalSteps
                  )} steps`}
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {selectedStepper !== "" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flexStart",
            alignItems: "center",
            flex: 2,
            marginRight: "40px",
            borderRadius: "5px"
          }}
        >
          <div style={{ marginTop: "40px" }}>
            <Typography variant="h2">{selectedStepper.displayName}</Typography>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginTop: "40px", marginRight: "10px" }}>
              <Paper className={classes.paper}>
                <TotalSteps
                  title={"Total Steps"}
                  totalGroupSteps={selectedStepper.totalSteps}
                />
              </Paper>
            </div>
            <div style={{ marginTop: "40px", marginLeft: "10px" }}>
              <Paper className={classes.paper}>
                <AverageSteps
                  totalGroupSteps={selectedStepper.totalSteps}
                  numberOfDays={userDailyTotals.length}
                />
              </Paper>
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <React.Fragment>
              <Paper className={classes.paper}>
                <Title>Tops Days</Title>
                <TableRow size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Total Steps</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userDailyTotals &&
                      userDailyTotals.map(day => (
                        <TableRow key={day.id}>
                          <TableCell>
                            {moment(day.id).format("MMMM Do, YYYY")}
                          </TableCell>
                          <TableCell>{day.steps}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </TableRow>
              </Paper>
            </React.Fragment>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flexStart",
          flex: 1,
          marginRight: "40px",
          borderRadius: "5px"
        }}
      />
    </div>
  );
}
