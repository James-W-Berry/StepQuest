import React from "react";
import { Typography } from "@material-ui/core";
import colors from "../assets/colors";

export default function Announcement(props) {
  return (
    <React.Fragment>
      <Typography variant="h3" style={{ color: colors.stepitup_teal }}>
        Arriver Activity Challenge
      </Typography>
      <Typography variant="h5" style={{ color: colors.almostBlack }}>
        Here we go again! This challenge runs from February 1st - 28th.
      </Typography>
      <br />
      <Typography variant="h5" style={{ color: colors.almostBlack }}>
        Join your team and enter your daily physical activity duration to count
        them towards your team's total. The team with the highest average member
        activity total for the month wins!
      </Typography>
    </React.Fragment>
  );
}
