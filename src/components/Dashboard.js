import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "./Chart";
import firebase from "../firebase";
import TotalMetricCard from "./TotalMetricCard";
import TopUsers from "./TopUsers";
import TopTeams from "./TopTeams";
import colors from "../assets/colors";
import Announcement from "./Announcement";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: colors.stepitup_teal,
  },
  fixedHeight: {
    height: 240,
  },
}));

function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((users) => {
        const newUsers = users.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(newUsers);
      });
  }, []);

  let totalDuration = 0;
  users.forEach((user) => {
    if (user.totalDuration) {
      totalDuration += user.totalDuration;
    }
  });
  return totalDuration;
}

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const totalActivityDuration = useUsers();

  return (
    <Grid container spacing={4}>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Announcement />
      </Grid>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Paper className={fixedHeightPaper}>
          <TotalMetricCard
            title={"Total Arriver Activity Duration"}
            total={totalActivityDuration}
            unit="minutes"
          />
        </Paper>
      </Grid>
      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
        <Paper className={classes.paper}>
          <TopUsers />
        </Paper>
      </Grid>
      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
        <Paper className={classes.paper}>
          <TopTeams />
        </Paper>
      </Grid>
    </Grid>
  );
}
