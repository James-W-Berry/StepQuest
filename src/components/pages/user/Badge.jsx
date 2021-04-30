import { Tooltip } from "@material-ui/core";
import React from "react";
import colors from "../../../assets/colors";
import medal from "../../../assets/medal.png";

export default function Badge(props) {
  const { data } = props;

  const applyMedalColor = {
    gold: "#FFD700",
    silver: "C0C0C0",
    bronze: "CD7F32",
    welcome: colors.stepitup_blue,
    createChallenge: colors.stepitup_purple,
    participation: colors.stepitup_teal,
    mostImproved: colors.stepitup_vibrantGreen,
  };

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        margin: "10px",
        borderRadius: "25px",
        backgroundColor: `${applyMedalColor[data.type]}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Tooltip title={data.title}>
        <img src={medal} alt="logo" height={40} width={40} />
      </Tooltip>
    </div>
  );
}
