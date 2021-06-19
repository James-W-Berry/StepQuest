import "firebase/auth";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import photo_0 from "../../../assets/landing_0.png";
import photo_1 from "../../../assets/landing_1.png";
import photo_2 from "../../../assets/landing_2.png";
import photo_3 from "../../../assets/landing_3.png";
import FeatureTile from "./FeatureTile";
import ChallengeTile from "./ChallengeTile";
import colors from "../../../assets/colors";

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

const features = [
  {
    title: "Feature 1",
    picture: photo_0,
    description: "Test feature 1",
  },
  {
    title: "Feature 2",
    picture: photo_0,

    description: "Test feature 2",
  },
  {
    title: "Feature 3",
    picture: photo_0,

    description: "Test feature 3",
  },
  {
    title: "Feature 4",
    picture: photo_0,

    description: "Test feature 4",
  },
  {
    title: "Feature 5",
    picture: photo_0,

    description: "Test feature 5",
  },
  {
    title: "Feature 6",
    picture: photo_0,

    description: "Test feature 6",
  },
];

export default function Landing() {
  const classes = useStyles();
  const theme = useTheme();
  const isAboveMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
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
    <Grid container style={{ minHeight: "100%" }}>
      <div className="landing-background">
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="landing">
          <Typography className="landing-title">
            StepQuest fitness challenges.
          </Typography>
          <Typography className="landing-subtitle">
            A better way to work out.
          </Typography>
          <NavLink to={`/signup`} className={classes.navLink}>
            <button className="landing-button ">
              <Typography>TAKE THE FIRST STEP</Typography>
            </button>
          </NavLink>
        </Grid>
        {isAboveMediumScreen && (
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
              backgroundSize: "contain",
              backgroundImage: `url(${data})`,
            }}
          />
        )}
      </div>
      <div className="landing-section">
        <Typography style={{ fontSize: "1.25rem", fontWeight: 300 }}>
          FEATURES
        </Typography>
        <Grid container style={{ display: "flex" }}>
          {features.map((feature) => {
            return <FeatureTile feature={feature} />;
          })}
        </Grid>
      </div>
      <div
        className="landing-section"
        style={{ backgroundColor: colors.stepQuestLightGray }}
      >
        <Typography style={{ fontSize: "1.25rem", fontWeight: 300 }}>
          JOIN A CHALLENGE
        </Typography>
        <Typography>Ready to start?</Typography>
        <Typography>
          Find the right challenge for you! Here are a few popular challenges
          you may be interested in.
        </Typography>
        <Grid container style={{ display: "flex", marginBottom: "60px" }}>
          {features.map((challenge) => {
            return <ChallengeTile challenge={challenge} />;
          })}
        </Grid>
        <NavLink to={`/join-a-challenge`} className="nav-link-dark">
          <button className="header-menu-button-dark">
            <p className="nav-link-dark">BROWSE CHALLENGES</p>
          </button>
        </NavLink>
      </div>
    </Grid>
  );
}
