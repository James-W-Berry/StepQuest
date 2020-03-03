import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import moment from "moment";

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const AverageSteps = props => {
  const classes = useStyles();

  const today = moment().format("MMMM Do, YYYY");

  return (
    <React.Fragment>
      <Title>Average Daily Steps</Title>
      <Typography
        style={{ marginTop: "20px", color: "#171820" }}
        component="p"
        variant="h3"
      >
        {props.numberOfDays === 0
          ? 0
          : numberWithCommas(props.totalGroupSteps / props.numberOfDays)}
      </Typography>
      <Typography
        style={{ marginTop: "10px", color: "#171820" }}
        variant="subtitle1"
        className={classes.stepContext}
      >
        Goal: 7,000
      </Typography>
    </React.Fragment>
  );
};

export default AverageSteps;
