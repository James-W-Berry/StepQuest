import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

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

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

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
