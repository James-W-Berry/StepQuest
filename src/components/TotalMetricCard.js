import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import colors from "../assets/colors";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
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
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: colors.stepitup_teal,
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
  fixedHeight: {
    height: 240,
  },
}));

function numberWithCommas(x) {
  if (x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

const TotalMetricCard = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const today = moment().format("MMMM Do, YYYY");

  return (
    <Grid
      item
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      spacing={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper className={fixedHeightPaper}>
        <Typography h1 className={classes.lightTextTitle}>
          {props.title}
        </Typography>
        <Typography
          style={{ marginTop: "20px", color: colors.almostWhite }}
          component="p"
          variant="h3"
        >
          {`${numberWithCommas(props.total)} ${props.unit ? props.unit : ""}`}
        </Typography>
        <Typography
          style={{ marginTop: "10px", color: "#171820" }}
          variant="subtitle1"
        >
          as of {today}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default TotalMetricCard;
