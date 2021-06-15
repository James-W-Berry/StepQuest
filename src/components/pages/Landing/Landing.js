import "firebase/auth";
import { makeStyles, Typography } from "@material-ui/core";
import LandingCarousel from "./LandingCarousel";
import { NavLink } from "react-router-dom";

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

  return (
    <div className="landing">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography className="landing-title">
          Fitness challenges for groups
        </Typography>
        <NavLink to={`/signup`} className={classes.navLink}>
          <button className="landing-button ">
            <Typography>TAKE THE FIRST STEP</Typography>
          </button>
        </NavLink>
      </div>

      {/* <div className="content">
        <LandingCarousel />
      </div> */}
    </div>
  );
}
