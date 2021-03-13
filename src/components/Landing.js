import React from "react";
import "../App.css";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography, Divider, Dialog } from "@material-ui/core";
import LandingCarousel from "./LandingCarousel";
import "typeface-roboto";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import colors from "../assets/colors";

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
      backgroundColor: colors.stepitup_blue,
    },
    border: 0,
    borderRadius: 3,
    backgroundColor: colors.stepitup_blue,
    height: 48,
    padding: "0 30px",
  },
  title: {
    fontFamily: "Monoton",
    textAlign: "center",
    color: colors.white,
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.5em",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "3.0em",
    },
  },
  subtitle: {
    color: colors.white,
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1em",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.5em",
    },
    marginBottom: "5vh",
  },
}));

function Landing(props) {
  const classes = useStyles();

  return (
    <div>
      <div class="bg">
        <div class="overlay">
          <div
            style={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "100%",
              height: "100%",
            }}
          >
            <div>
              <Typography className={classes.title}>Step It Up</Typography>

              <Typography className={classes.subtitle}>
                Your team's fitness tracking solution
              </Typography>
            </div>

            <div class="content">
              <LandingCarousel />
            </div>

            <div
              class="authbuttons"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <div>
                <NavLink
                  style={{
                    textDecoration: "none",
                  }}
                  to="/signin"
                >
                  <Button className={classes.root} style={{ width: "100%" }}>
                    <Typography
                      style={{
                        color: colors.almostWhite,
                        width: "max-content",
                      }}
                    >
                      Log In
                    </Typography>
                  </Button>
                </NavLink>
              </div>

              <div>
                <NavLink
                  style={{
                    textDecoration: "none",
                  }}
                  to="/signup"
                >
                  <Button className={classes.root} style={{ width: "100%" }}>
                    <Typography
                      style={{
                        color: colors.almostWhite,
                        width: "max-content",
                      }}
                    >
                      Sign Up
                    </Typography>
                  </Button>
                </NavLink>
              </div>
            </div>
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
