import React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const AverageMemberSteps = (props) => {
  return (
    <React.Fragment>
      <Title>Member Average Steps</Title>
      <Typography
        style={{ marginTop: "20px", color: "#171820" }}
        component="p"
        variant="h3"
      >
        {props.numberOfDays === 0
          ? 0
          : numberWithCommas(
              Math.round(props.totalGroupSteps / props.numberOfDays)
            )}
      </Typography>
    </React.Fragment>
  );
};

export default AverageMemberSteps;
