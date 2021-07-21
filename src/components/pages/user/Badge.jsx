import { Typography } from "@material-ui/core";
import colors from "../../../assets/colors";
import medal from "../../../assets/medal.png";

export default function Badge(props) {
  const { data } = props;

  const applyMedalColor = {
    gold: "#FFD700",
    silver: "C0C0C0",
    bronze: "CD7F32",
    welcome: colors.stepQuestOrange,
    createChallenge: colors.stepQuestYellow,
    participation: colors.stepQuestGray,
    mostImproved: colors.almostBlack,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          margin: "10px",
          borderRadius: "30px",
          backgroundColor: `${applyMedalColor[data.type]}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={medal} alt="logo" height={40} width={40} />
      </div>
      <Typography style={{ width: "75px", textAlign: "center" }}>
        {data.title}
      </Typography>
    </div>
  );
}
