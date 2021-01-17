import React from "react";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography, Divider } from "@material-ui/core";
import "typeface-roboto";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Img from "react-image";
import logo from "../assets/logo.png";
import team from "../assets/team.png";
import target from "../assets/target.png";
import chart from "../assets/chart.png";
import colors from "../assets/colors";

import "../App.css";

const Logo = () => <Img src={logo} height={50} width={50} />;
const TeamIcon = () => <Img src={team} height={60} width={60} />;
const TargetIcon = () => <Img src={target} height={60} width={60} />;
const ChartIcon = () => <Img src={chart} height={60} width={60} />;

const useStyles = makeStyles((theme) => ({
  divider: {
    border: "none",
    height: "1px",
    color: colors.almostWhite,
    margin: 0,
    flexShrink: 0,
    width: "100%",
  },
  root: {
    "&:hover": {
      color: "#ffffff80",
    },
    border: 0,
    borderRadius: 3,
    color: colors.almostWhite,
    height: 48,
    padding: "0 30px",
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.0em",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "3.0em",
    },
  },
  subtitle: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5em",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.0em",
    },
    marginBottom: "5vh",
  },
}));

function Landing(props) {
  const classes = useStyles();

  return (
    <div
      className="landing"
      style={{
        flex: 1,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: colors.almostBlack,
          height: "60px",
          width: "100vw",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            margin: "10px",
          }}
        >
          <Logo />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: "10px",
            flex: 3,
          }}
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: colors.almostWhite,
            }}
            to="/signin"
          >
            <Button className={classes.root} style={{ width: "100%" }}>
              <Typography
                style={{ color: colors.almostWhite, width: "max-content" }}
              >
                Sign In
              </Typography>
            </Button>
          </NavLink>

          <NavLink
            style={{
              textDecoration: "none",
              color: colors.almostWhite,
            }}
            to="/signup"
          >
            <Button className={classes.root} style={{ width: "100%" }}>
              <Typography
                style={{ color: colors.almostWhite, width: "max-content" }}
              >
                Sign Up
              </Typography>
            </Button>
          </NavLink>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Divider
          classes={{
            root: classes.divider,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1",
            flexDirection: "column",
          }}
        >
          <Typography
            className={classes.title}
            style={{ color: colors.stepitip_vibrantGreen }}
          >
            Step It Up
          </Typography>

          <Typography
            className={classes.subtitle}
            style={{ color: colors.almostWhite }}
          >
            Your team's fitness tracking solution
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              margin: "5px",
            }}
          >
            <TeamIcon />
            <Typography
              variant="body1"
              style={{ color: colors.almostBlack, marginLeft: "10px" }}
            >
              Tools to record your fitness activities with friends, family, and
              coworkers
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              margin: "5px",
            }}
          >
            <ChartIcon />
            <Typography
              variant="body1"
              style={{ color: colors.almostBlack, marginLeft: "10px" }}
            >
              Track organization, team, and individual activities over time
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              margin: "5px",
            }}
          >
            <TargetIcon />
            <Typography
              variant="body1"
              style={{ color: colors.almostBlack, marginLeft: "10px" }}
            >
              Set goals and encourage team members to increase physical wellness
              together
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Landing);
