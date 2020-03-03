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

const TotalSteps = props => {
  const classes = useStyles();

  const today = moment().format("MMMM Do, YYYY");

  return (
    <React.Fragment>
      <Title>Total Steps</Title>
      <Typography
        style={{ marginTop: "20px", color: "#171820" }}
        component="p"
        variant="h3"
      >
        {numberWithCommas(props.totalGroupSteps)}
      </Typography>
      <Typography
        style={{ marginTop: "10px", color: "#171820" }}
        variant="subtitle1"
        className={classes.stepContext}
      >
        as of {today}
      </Typography>
    </React.Fragment>
  );
};

export default TotalSteps;
