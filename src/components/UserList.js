import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import {
  Button,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TotalMetricCard from "./TotalMetricCard";
import moment from "moment";
import AverageMetricCard from "./AverageMetricCard";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 240,
  },
  root: {
    color: "#E7E5DF",
  },
  select: {
    "&:before": {
      borderColor: colors.stepitup_teal,
    },
    "&:after": {
      borderColor: colors.stepitup_teal,
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    "&:hover": {
      color: colors.almostWhite,
    },
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
    fixedHeight: 240,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flexStart",
    overflow: "hidden",
  },
  lightText: {
    color: colors.almostWhite,
  },
  lightTextTitle: {
    color: colors.almostWhite,
    fontSize: "1.25rem",
    fontWeight: "500",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
  title: {
    color: colors.almostBlack,
    fontSize: "1.25rem",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
  scrollbar: {
    [theme.breakpoints.down("sm")]: {
      height: "30vh",
    },
    [theme.breakpoints.up("md")]: {
      height: "70vh",
    },
    width: "100%",
    backgroundColor: colors.stepitup_blueishGray,
    overflow: "scroll",
    borderRadius: "10px",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  focusedUser: {
    [theme.breakpoints.down("sm")]: {
      borderTop: "1px #19191930 solid",
    },
    [theme.breakpoints.up("md")]: {
      borderLeft: "1px #19191930 solid",
    },
  },
  name: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2rem",
    },
  },
}));

const SORT_OPTIONS = {
  DURATION_ASC: { column: "totalDuration", direction: "asc" },
  DURATION_DESC: { column: "totalDuration", direction: "desc" },
};

async function calculateDailyTotals(user) {
  let response = await firebase
    .firestore()
    .collection("users")
    .doc(user.id)
    .collection("activities")
    .get()
    .then((days) => {
      const daysData = days.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return daysData;
    });

  let daySums = [];

  response.forEach((day) => {
    let sum = 0;

    Object.entries(day).forEach((activity) => {
      if (activity[0] !== "id") {
        sum += activity[1];
      }
    });

    let result = {
      day: day.id.toString(),
      sum: sum,
    };

    daySums.push(result);
  });

  daySums.sort((a, b) => (a.sum < b.sum ? 1 : -1));

  let top5 = daySums.slice(0, 5);
  let values = {};
  values.top5 = top5;
  values.allDays = daySums;
  return values;
}

async function calculateTopUserActivities(user) {
  let activities = [];
  let top5 = [];
  let values = {};
  Object.entries(user).forEach((field) => {
    if (field[0].toString().includes("activity_total_")) {
      activities.push(field);
    }
  });
  activities.sort((a, b) => (a[1] < b[1] ? 1 : -1));
  top5 = activities.slice(0, 5);
  values.allActivities = activities;
  values.top5 = top5;
  return values;
}

export default function UserList() {
  const classes = useStyles();
  const sortBy = "DURATION_DESC";
  const [selectedUser, setSelectedUser] = useState("");
  const [totals, setTotals] = useState();
  const [topActivities, setTopActivities] = useState();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("fetching users");
    firebase
      .firestore()
      .collection("users")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .get()
      .then((retrievedUsers) => {
        const newUsers = retrievedUsers.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(newUsers);
      })
      .catch(function (error) {
        console.log(error);
        return [];
      });
  }, []);

  function numberWithCommas(x) {
    if (x !== undefined) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "";
    }
  }

  async function handleUserClicked(user) {
    setSelectedUser(user);
    await calculateDailyTotals(user).then((totals) => {
      setTotals(totals);
    });
    await calculateTopUserActivities(user).then((activities) => {
      setTopActivities(activities);
    });
  }

  return (
    <Grid
      container
      spacing={4}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Grid
        key="userlist"
        xs={12}
        sm={12}
        md={4}
        lg={4}
        xl={4}
        item
        className={classes.userList}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" className={classes.title}>
            Leaderboard
          </Typography>
        </div>
        <Grid
          key="list"
          container
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper className={classes.scrollbar}>
            {users.map((user) => (
              <div>
                <Button
                  Button
                  className={classes.button}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  onClick={() => handleUserClicked(user)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={user.profilePictureUrl}
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "10px",
                      }}
                    />
                    {user.displayName}
                  </div>
                </Button>
              </div>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Grid key="focusedUser" item xs={12} sm={12} md={8} lg={8} xl={8}>
        {selectedUser !== "" ? (
          <div
            className={classes.focusedUser}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flexStart",
              alignItems: "center",
              flex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flexStart",
                alignItems: "center",
              }}
            >
              <Avatar
                src={selectedUser.profilePictureUrl}
                style={{
                  height: "120px",
                  width: "120px",
                  margin: "10px",
                }}
              />
              <Typography
                variant="h2"
                style={{ color: colors.almostBlack }}
                className={classes.name}
              >
                {selectedUser.displayName}
              </Typography>
            </div>

            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <TotalMetricCard
                  style={{ width: "100%" }}
                  title={"Total Activity Duration"}
                  total={selectedUser.totalDuration}
                  unit="minutes"
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {totals?.allDays && (
                  <AverageMetricCard
                    style={{ width: "100%" }}
                    title="Average Daily Duration"
                    total={selectedUser.totalDuration}
                    numberOfDays={totals.allDays.length}
                    unit="minutes"
                  />
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <React.Fragment>
                  <Paper className={classes.paper}>
                    <Typography variant="h5" className={classes.lightTextTitle}>
                      Top Days
                    </Typography>
                    <TableRow size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Total Duration (minutes)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {totals?.top5 &&
                          totals.top5.map((day) => (
                            <TableRow key={day.day}>
                              <TableCell>
                                {moment(day.day).format("MMMM Do, YYYY")}
                              </TableCell>
                              <TableCell>{numberWithCommas(day.sum)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </TableRow>
                  </Paper>
                </React.Fragment>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <React.Fragment>
                  <Paper className={classes.paper}>
                    <Typography h1 className={classes.lightTextTitle}>
                      Top Activities
                    </Typography>
                    <TableRow size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Activity</TableCell>
                          <TableCell>Total Duration (minutes)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topActivities?.top5 &&
                          topActivities.top5.map((activity) => (
                            <TableRow key={activity[0]}>
                              <TableCell>
                                {activity[0].replace("activity_total_", "")}
                              </TableCell>
                              <TableCell>
                                {numberWithCommas(activity[1])}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </TableRow>
                  </Paper>
                </React.Fragment>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div
            className={classes.focusedUser}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography h1 className={classes.title}>
              Select a user to see their stats
            </Typography>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
