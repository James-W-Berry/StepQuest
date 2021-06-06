import { Typography } from "@material-ui/core";
import missing from "../../../assets/404_missing_user.png";
import HomeIcon from "@material-ui/icons/Home";

export default function MissingChallenge() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "50%",
          margin: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={missing} alt="logo" height={"100%"} width={"100%"} />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography style={{ textAlign: "center" }}>
          We can't seem to find this challenge. Maybe everyone went home for the
          day
        </Typography>
        <HomeIcon style={{ marginLeft: "5px" }} height={40} width={40} />
      </div>
    </div>
  );
}
