import "firebase/auth";
import { makeStyles, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import photo_0 from "../../../assets/landing_0.png";
import photo_1 from "../../../assets/landing_1.png";
import photo_2 from "../../../assets/landing_2.png";
import photo_3 from "../../../assets/landing_3.png";

const useStyles = makeStyles((theme) => ({
  navLink: {
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
  },
}));

export default function Landing() {
  const classes = useStyles();
  const number = Math.floor(Math.random() * 4);
  let data = 0;
  switch (number) {
    case 0:
      data = photo_0;
      break;
    case 1:
      data = photo_1;
      break;
    case 2:
      data = photo_2;

      break;
    case 3:
      data = photo_3;

      break;
    default:
  }

  return (
    <div
      className="landing-background"
      style={{
        backgroundImage: `url(${data})`,
      }}
    >
      <div className="landing">
        <Typography className="landing-title">
          A better way to enjoy working out.
        </Typography>
        <Typography className="landing-subtitle">
          Create, organize, and participate in fitness challenges
        </Typography>
        <NavLink to={`/signup`} className={classes.navLink}>
          <button className="landing-button ">
            <Typography>TAKE THE FIRST STEP</Typography>
          </button>
        </NavLink>
      </div>
    </div>
  );
}
