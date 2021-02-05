import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
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
    borderRadius: "10px",
  },
  fixedHeight: {
    height: 240,
  },
}));

function useTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("groups")
      .get()
      .then((teams) => {
        const retrievedTeams = teams.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        retrievedTeams.sort((a, b) =>
          a.totalDuration < b.totalDuration ? 1 : -1
        );
        setTeams(retrievedTeams);
      });
  }, []);

  return teams;
}

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const teams = useTeams();
  const [totalOrgDuration, setTotalOrgDuration] = useState(0);

  useEffect(() => {
    let totalDuration = 0;
    teams.forEach((team) => {
      if (team.totalDuration) {
        totalDuration += team.totalDuration;
      }
    });
    setTotalOrgDuration(totalDuration);
  }, [teams]);

  return (
    <Grid container spacing={4}>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Announcement />
      </Grid>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <TotalMetricCard
          title={"Total Arriver Activity Duration"}
          total={totalOrgDuration}
          unit="minutes"
        />
      </Grid>
      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
        <Paper className={classes.paper}>
          <TopUsers />
        </Paper>
      </Grid>
      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
        <Paper className={classes.paper}>
          <TopTeams teams={teams} />
        </Paper>
      </Grid>
    </Grid>
  );
}
