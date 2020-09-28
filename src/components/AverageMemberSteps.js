import React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const AverageMemberSteps = (props) => {
  return (
    <React.Fragment>
      <Title>{`Average Steps for a ${props.groupName} member`}</Title>
      <Typography
        style={{ marginTop: "20px", color: "#171820" }}
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
