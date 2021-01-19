import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import colors from "../assets/colors";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  stepContext: {
    flex: 1,
  },
  lightTextTitle: {
    color: colors.almostWhite,
    fontSize: "1.25rem",
    fontWeight: "500",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DaySummary = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  let formattedDate;
  let totalDaySteps;

  if (props.selectedDate !== "") {
    try {
      formattedDate = moment(props.selectedDate).format("MMMM Do, YYYY");
      totalDaySteps = props.totalDaySteps;
    } catch {
      console.log("invalid date");
    }
  } else {
    formattedDate = "No date selected yet";
    totalDaySteps = "";
  }

  return (
    <Paper className={fixedHeightPaper}>
      <Typography h1 className={classes.lightTextTitle}>
        Activity Summary
      </Typography>
      <Typography h3>{formattedDate}</Typography>
      <Typography
        style={{ marginTop: "20px", color: colors.almostWhite }}
        component="p"
        variant="h3"
      >
        {numberWithCommas(totalDaySteps)}
      </Typography>
    </Paper>
  );
};

export default DaySummary;
