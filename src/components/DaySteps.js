import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import moment from "moment";
import colors from "../assets/colors";

const useStyles = makeStyles({
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
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DaySteps = (props) => {
  const classes = useStyles();

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
    formattedDate = "Pick a day to record your steps";
    totalDaySteps = "";
  }

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        Step Count
      </Typography>
      <Typography
        style={{ marginTop: "20px", color: colors.almostWhite }}
        component="p"
        variant="h3"
      >
        {numberWithCommas(totalDaySteps)}
      </Typography>
      <Typography
        style={{ marginTop: "10px", color: colors.almostBlack }}
        variant="subtitle1"
        className={classes.stepContext}
      >
        {formattedDate}
      </Typography>
    </React.Fragment>
  );
};

export default DaySteps;
