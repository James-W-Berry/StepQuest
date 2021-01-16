import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import colors from "../assets/colors";

const useStyles = makeStyles({
  depositContext: {
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

const AverageSteps = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        Average Daily Steps
      </Typography>
      <Typography
        style={{ marginTop: "20px", color: colors.almostWhite }}
        component="p"
        variant="h3"
      >
        {props.numberOfDays === 0
          ? 0
          : numberWithCommas(
              Math.round(props.totalGroupSteps / props.numberOfDays)
            )}
      </Typography>
      <Typography
        style={{ marginTop: "10px", color: colors.almostBlack }}
        variant="subtitle1"
        className={classes.stepContext}
      >
        Goal: 7,000
      </Typography>
    </React.Fragment>
  );
};

export default AverageSteps;
