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
import logo from "../assets/walk.png";
import landingPhoto from "../assets/walking.jpg";
import SyncLoader from "react-spinners/SyncLoader";

const Logo = () => <Img src={logo} height={60} />;

const useStyles = makeStyles({
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#171820",
    margin: 0,
    flexShrink: 0,
    width: "100%"
  },
  root: {
    "&:hover": {
      color: "#17182090"
    },
    border: 0,
    borderRadius: 3,
    color: "#171820",
    height: 48,
    padding: "0 30px"
  }
});

function Landing(props) {
  const classes = useStyles();

  return (
    <div
      style={{
        flex: 1,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${landingPhoto})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px",
            flex: 1
          }}
        >
          <Logo />
          <Typography
            variant="h5"
            style={{ color: "#171820", marginLeft: "20px" }}
          >
            Step It Up
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flex: 3
          }}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            margin: "10px"
          }}
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: "#171820"
            }}
            to="/signup"
          >
            <Button className={classes.root}>Sign Up</Button>
          </NavLink>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            margin: "10px"
          }}
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: "#171820"
            }}
            to="/signin"
          >
            <Button className={classes.root}>Sign In</Button>
          </NavLink>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Divider
          classes={{
            root: classes.divider
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          marginTop: "10vh",
          marginLeft: "10vw"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1",
            flexDirection: "column"
          }}
        >
          <Typography variant="h3" style={{ color: "#171820" }}>
            Your step tracking solution
          </Typography>

          <Typography
            variant="body1"
            style={{ color: "#171820", marginTop: "25px" }}
          >
            Step It Up provides a common space to record your daily steps along
            with friends, family, and coworkers.
          </Typography>

          <div
            style={{
              display: "flex",
              flex: "1",
              alignItems: "center"
            }}
          >
            <Typography variant="body1" style={{ color: "#171820" }}>
              Track group and individual performance over time and encourage and
              compete to increase physical wellness.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(Landing);
