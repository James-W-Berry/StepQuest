import React, { useState } from "react";
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

import "../App.css";

const Logo = () => <Img src={logo} height={50} width={50} />;
const TeamIcon = () => <Img src={team} height={60} width={60} />;
const TargetIcon = () => <Img src={target} height={60} width={60} />;
const ChartIcon = () => <Img src={chart} height={60} width={60} />;

const useStyles = makeStyles({
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#ffffff",
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
    color: "#ffffff",
    height: 48,
    padding: "0 30px",
  },
});

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
          background: "#191919",
          height: "60px",
          width: "100vw",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: "20px",
          }}
        >
          <Logo />
          <Typography
            variant="h5"
            style={{ color: "#ffffff", marginLeft: "20px" }}
          >
            Step It Up
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: "10px",
            flex: 1,
          }}
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: "#ffffff",
            }}
            to="/signin"
          >
            <Button className={classes.root}>Sign In</Button>
          </NavLink>

          <NavLink
            style={{
              textDecoration: "none",
              color: "#ffffff",
            }}
            to="/signup"
          >
            <Button className={classes.root}>Sign Up</Button>
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
          margin: "10%",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3" style={{ color: "#ffffff" }}>
            Your team's fitness tracking solution
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "5vh",
            }}
          >
            <TeamIcon />
            <Typography
              variant="body1"
              style={{ color: "#ffffff", marginLeft: "10px" }}
            >
              Tools to record your fitness activities with friends, family, and
              coworkers
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "5vh",
            }}
          >
            <ChartIcon />

            <Typography
              variant="body1"
              style={{ color: "#ffffff", marginLeft: "10px" }}
            >
              Track organization, team, and individual activities over time
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "5vh",
            }}
          >
            <TargetIcon />

            <Typography
              variant="body1"
              style={{ color: "#ffffff", marginLeft: "10px" }}
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
