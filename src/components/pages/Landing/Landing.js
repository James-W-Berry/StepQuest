import "firebase/auth";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import photo_0 from "../../../assets/landing_0.png";
import photo_1 from "../../../assets/landing_1.png";
import photo_2 from "../../../assets/landing_2.png";
import photo_3 from "../../../assets/landing_3.png";
import FeatureTile from "./FeatureTile";
import ChallengeTile from "./ChallengeTile";
import colors from "../../../assets/colors";
import Footer from "../../Footer";

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
    title: "Find challenge",
    picture: photo_0,
    description: "Find and join the perfect challenge for you",
  },
  {
    title: "Create challenge",
    picture: photo_0,
    description: "Create a custom challenge for your needs",
  },
  {
    title: "Invite",
    picture: photo_0,
    description: "Invite members via email or by sharing a direct link",
  },
  {
    title: "Track progress",
    picture: photo_0,
    description: "See how members are progressing throughout the challenge",
  },
  {
    title: "Awards",
    picture: photo_0,
    description: "Award badges at the end of challenge ceremony",
  },
];

const challenges = [
  {
    title: "Stepocalypse 2021",
    picture: photo_0,
    startDate: "July 1st, 2021",
    endDate: "July 31st, 2021",
    description:
      "Step challenge - open to all! Come join us and see how many steps you can take!",
  },
  {
    title: "Pushup Mitten Mania",
    picture: photo_0,
    startDate: "July 1st, 2021",
    endDate: "July 31st, 2021",
    description:
      "Pushup challenge for the state of Michigan. How many can you do in a month?!? Prizes for winner and most improved!",
  },
  {
    title: "Bikeorama",
    picture: photo_0,
    startDate: "July 1st, 2021",
    endDate: "July 31st, 2021",
    description:
      "Bike mile challenge for bikers in Traverse City. Let's hit the road!",
  },
];

const getLandingPhoto = () => {
  const number = Math.floor(Math.random() * 4);
  let photo = 0;
  switch (number) {
    case 0:
      photo = photo_0;
      break;
    case 1:
      photo = photo_1;
      break;
    case 2:
      photo = photo_2;

      break;
    case 3:
      photo = photo_3;

      break;
    default:
  }
  return photo;
};

export default function Landing() {
  const classes = useStyles();
  const photo = getLandingPhoto();

  return (
    <Grid container style={{ minHeight: "100%" }}>
      <div className="landing-background">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="landing">
          <Typography className="landing-title">StepQuest</Typography>
          <Typography className="landing-subtitle">
            Fitness challenges
          </Typography>
          <Typography
            className="landing-subtitle"
            style={{ paddingTop: "50px" }}
          >
            A better way to work out
          </Typography>
          <NavLink to={`/signup`} className={classes.navLink}>
            <button className="landing-button ">
              <Typography>TAKE THE FIRST STEP</Typography>
            </button>
          </NavLink>
        </Grid>
        <Grid
          className="landing"
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            padding: "0px",
            flex: 1,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundSize: "contain",
            backgroundImage: `url(${photo})`,
          }}
        />
      </div>
      <div className="form-section">
        <Typography className="section-header-big">FEATURES</Typography>
        <Grid
          container
          spacing={8}
          style={{
            display: "flex",
            paddingLeft: "10%",
            paddingRight: "10%",
            justifyContent: "center",
          }}
        >
          {features.map((feature) => {
            return (
              <Grid
                key={feature.title}
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
              >
                <FeatureTile feature={feature} />{" "}
              </Grid>
            );
          })}
        </Grid>
      </div>
      <div
        className="form-section"
        style={{
          backgroundColor: colors.stepQuestLightGray,
          paddingBottom: "60px",
          marginBottom: "0px",
        }}
      >
        <Typography className="section-header-big">JOIN A CHALLENGE</Typography>
        <Typography className="section-body" style={{ paddingTop: "20px" }}>
          Ready to start? Let's find the right challenge for you!
        </Typography>
        <Typography className="section-body" style={{ paddingBottom: "20px" }}>
          Here are some popular challenges you may be interested in.
        </Typography>
        <Grid
          container
          spacing={8}
          style={{
            display: "flex",
            marginBottom: "60px",
            paddingLeft: "10%",
            paddingRight: "10%",
            justifyContent: "center",
          }}
        >
          {challenges.map((challenge) => {
            return (
              <Grid
                key={challenge.title}
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
              >
                <ChallengeTile challenge={challenge} />
              </Grid>
            );
          })}
        </Grid>
        <NavLink to={`/join-a-challenge`} className="nav-link-dark">
          <button className="header-menu-button-dark">
            <p className="nav-link-dark">BROWSE CHALLENGES</p>
          </button>
        </NavLink>
      </div>
      <Footer />
    </Grid>
  );
}
