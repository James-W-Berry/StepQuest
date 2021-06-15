import React, { useState } from "react";
import "../../../App.css";
import "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import LandingCarousel from "./LandingCarousel";
import firebase from "../../../firebase";
import "firebase/auth";
import "typeface-roboto";
import colors from "../../../assets/colors";
import google from "../../../assets/google.png";
import ForgottenPasswordDialog from "./ForgottenPasswordDialog";
import { signInUserWithProvider } from "../../../api/authApi";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover": {
      backgroundColor: colors.almostWhite,
    },
    border: 0,
    borderRadius: 3,
    backgroundColor: colors.white,
    color: colors.stepitup_blue,
    height: "48px",
    padding: "0 30px",
    margin: "5px",
  },
  title: {
    fontFamily: "Josefin Sans",
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
  },
  buttoncontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
  },
  googleSubmit: {
    "&:hover": {
      backgroundColor: colors.almostWhite,
    },
    border: 0,
    borderRadius: 3,
    backgroundColor: colors.white,
    color: colors.stepitup_blue,
    margin: "5px",
    height: "48px",
  },
}));

const provider = new firebase.auth.GoogleAuthProvider();

export default function Landing(props) {
  const classes = useStyles();
  const [forgottenPasswordVisible, setForgottenPasswordVisible] =
    useState(false);
  const history = useHistory();

  const onGoogleSignIn = () => {
    signInUserWithProvider(provider).then((response) => {
      if (response.success) {
        console.log(response.message);
      } else {
        history.push("/");
        alert(response.message);
      }
    });
  };

  return (
    <div>
      <div className="bg">
        <div className="overlay">
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
              <Typography className={classes.subtitle}>
                Fitness challenges for groups
              </Typography>
            </div>

            <div className="content">
              <LandingCarousel />
            </div>

            <div className={classes.buttoncontainer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button className={classes.button}>
                  <Typography>Log In</Typography>
                </Button>

                <Button className={classes.button}>
                  <Typography>Sign Up</Typography>
                </Button>

                <Button
                  className={classes.googleSubmit}
                  onClick={() => {
                    onGoogleSignIn();
                  }}
                >
                  <img src={google} height={48} alt="Sign in with Google" />
                </Button>
              </div>
            </div>
          </div>
          <ForgottenPasswordDialog
            isOpen={forgottenPasswordVisible}
            setDialogVisible={(value) => setForgottenPasswordVisible(value)}
          />
        </div>
      </div>
    </div>
  );
}
