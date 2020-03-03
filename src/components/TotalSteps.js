import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import moment from "moment";

function preventDefault(event) {
  event.preventDefault();
}

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
      <Title>Total Group Steps</Title>
      <Typography component="p" variant="h4">
        {numberWithCommas(props.totalGroupSteps)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        as of {today}
      </Typography>
    </React.Fragment>
  );
};

export default TotalSteps;
