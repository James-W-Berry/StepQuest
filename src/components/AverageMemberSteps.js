import React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { makeStyles } from "@material-ui/core/styles";
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

const AverageMemberSteps = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        {`Average Steps for a ${props.groupName} member`}
      </Typography>
      <Typography
        style={{ marginTop: "20px", color: colors.almostWhite }}
        component="p"
        variant="h3"
      >
        {props.numberOfMembers === 0
          ? null
          : numberWithCommas(
              Math.round(props.totalGroupSteps / props.numberOfMembers)
            )}
      </Typography>
    </React.Fragment>
  );
};

export default AverageMemberSteps;
