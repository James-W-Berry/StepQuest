import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
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
}));

function numberWithCommas(x) {
  if (x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

const AverageMemberMetric = (props) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grid
      item
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper className={fixedHeightPaper}>
        <Typography variant="h5" className={classes.lightTextTitle}>
          {`Average Total Activity Duration`}
        </Typography>
        <Typography
          style={{ marginTop: "20px", color: colors.almostWhite }}
          component="p"
          variant="h3"
        >
          {props.numberOfMembers === 0
            ? null
            : `${numberWithCommas(
                Math.round(props.total / props.numberOfMembers)
              )} minutes`}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default AverageMemberMetric;
