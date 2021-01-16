import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "./Chart";
import firebase from "../firebase";
import TotalSteps from "./TotalSteps";
import TopSteppers from "./TopSteppers";
import TopGroups from "./TopGroups";
import colors from "../assets/colors";

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
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        const newUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(newUsers);
      });

    return () => unsubscribe();
  }, []);

  let totalGroupSteps = 0;
  users.map((user) => {
    if (user.totalSteps) {
      totalGroupSteps += user.totalSteps;
    }
  });
  return totalGroupSteps;
}

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const totalGroupSteps = useUsers();

  return (
    <Grid container spacing={4} style={{ marginTop: "20px" }}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <TotalSteps title={"Total Steps"} totalGroupSteps={totalGroupSteps} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={classes.paper}>
          <TopSteppers />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={classes.paper}>
          <TopGroups />
        </Paper>
      </Grid>
    </Grid>
  );
}
