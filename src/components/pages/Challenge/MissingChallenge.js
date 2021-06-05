import { Typography } from "@material-ui/core";
import missing from "../../../assets/404_missing_user.png";

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
      <Typography variant="h3" style={{ textAlign: "center" }}>
        Oh no! We tripped up!
      </Typography>
      <Typography style={{ textAlign: "center" }}>
        We can't seem to find this user. They may be taking a water break.
      </Typography>
    </div>
  );
}
