import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import colors from "../assets/colors";
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
}));

function numberWithCommas(x) {
  if (x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

const DaySummary = (props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography h1 className={classes.lightTextTitle}>
        Activity Summary
      </Typography>
      <Typography h3>
        {moment(props.selectedDate).format("MMMM Do, YYYY")}
      </Typography>
      <Typography
        style={{ marginTop: "20px", color: colors.almostWhite }}
        component="p"
        variant="h3"
      >
        {numberWithCommas(props.total)} total minutes
      </Typography>
      {props.content && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Object.entries(props.content).map(
            (item) =>
              item[0] !== "id" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                  }}
                >
                  <Typography>{item[0]}</Typography>
                  <Typography style={{ marginLeft: "10px" }}>
                    - {item[1]} minutes
                  </Typography>
                </div>
              )
          )}
        </div>
      )}
    </Paper>
  );
};

export default DaySummary;
