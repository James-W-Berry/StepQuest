import { Typography } from "@material-ui/core";
import missing from "../../../assets/404_missing_user.png";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";

export default function MissingUser() {
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography style={{ textAlign: "center" }}>
          We can't seem to find this user. Maybe they're taking a water break
        </Typography>
        <LocalDrinkIcon style={{ marginLeft: "5px" }} height={40} width={40} />
      </div>
    </div>
  );
}
