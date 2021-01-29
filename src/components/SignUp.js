import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "typeface-roboto";
import { Typography, Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import Img from "react-image";
import logo from "../assets/logo.png";
import { withStyles } from "@material-ui/core/styles";
import SyncLoader from "react-spinners/SyncLoader";
import colors from "../assets/colors";

const Logo = () => <Img src={logo} height={40} width={40} />;

const useStyles = makeStyles((theme) => ({
  divider: {
    border: "none",
    height: "1px",
    color: colors.almostWhite,
    margin: 0,
    flexShrink: 0,
    width: "100%",
  },
  textInput: {
    "& label ": {
      color: colors.almostWhite,
    },
    "& label.Mui-focused": {
      color: colors.almostWhite,
    },
    "& .MuiInput-underline:after": {
      color: colors.almostWhite,
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
      width: "40%",
    },
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
  input: {
    color: colors.almostWhite,
  },
  button: {
    background: colors.almostWhite,
    "&:hover": {
      color: colors.stepitup_vibrantGreen,
    },
    border: 0,
    borderRadius: 3,
    color: colors.almostBlack,
    height: 48,
    padding: "0 30px",
  },
}));

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  function onSignUp(username, email, password) {
    setIsLoading(true);
    const db = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        var userId = firebase.auth().currentUser.uid;

        db.collection("users")
          .doc(userId)
          .set({
            displayName: username,
            totalDuration: 0,
          })
          .catch(function (error) {
            console.log(error);
          });

        console.log("sign up successful");
      })
      .catch(function (error) {
        var errorMessage = error.message;
        setIsLoading(false);
        alert(errorMessage);
      });
  }

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
        <NavLink
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            textDecoration: "none",
          }}
          to="/home"
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
        </NavLink>

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
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-username-input"
          label="Display Name"
          type="username"
          InputProps={{
            className: classes.input,
          }}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <TextField
          className={classes.textInput}
          id="standard-email-input"
          label="Email"
          type="email"
          autoComplete="email"
          InputProps={{
            className: classes.input,
          }}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          className={classes.textInput}
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          InputProps={{
            className: classes.input,
          }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        {isLoading ? (
          <SyncLoader color={colors.almostWhite} />
        ) : (
          <Button
            onClick={() => {
              onSignUp(username, email, password);
            }}
            className={classes.button}
          >
            Sign Up
          </Button>
        )}
      </div>
    </div>
  );
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(SignUp);
