import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import moment from "moment";

const useStyles = makeStyles({
  stepContext: {
    flex: 1
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DaySteps = props => {
  const classes = useStyles();

  let formattedDate;

  if (props.selectedDate !== "") {
    try {
      formattedDate = moment(props.selectedDate).format("MMMM Do, YYYY");
    } catch {
      console.log("invalid date");
    }
  } else {
    formattedDate = "Pick a day to record your steps";
  }

  return (
    <React.Fragment>
      <Title>Step Count</Title>
      <Typography style={{ marginTop: "50px" }} component="p" variant="h1">
        {numberWithCommas(props.totalDaySteps)}
      </Typography>
      <Typography
        style={{ marginTop: "50px" }}
        variant="subtitle1"
        color="textSecondary"
        className={classes.stepContext}
      >
        {formattedDate}
      </Typography>
    </React.Fragment>
  );
};

export default DaySteps;
