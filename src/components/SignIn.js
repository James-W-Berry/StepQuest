import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import SignUp from "./SignUp";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import "typeface-roboto";

const useStyles = makeStyles({
  textInput: {
    width: "20vw",
    "& label.Mui-focused": {
      color: "#171820"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#171820"
    }
  },
  root: {
    background: "#171820",
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 48,
    padding: "0 30px"
  }
});

function onSignIn(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      console.log("Sign in successful");
    })
    .catch(function(error) {
      alert("Incorrect email or password, please try again");
    });
}

function onResetPassword(email) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function() {
      alert("Check your email to reset your password.");
    })
    .catch(function(error) {
      alert(
        "Could not send email, please enter your email address and try again."
      );
    });
}

function SignIn() {
  const [user, setUser] = useState({ isNew: false });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();
  if (user.isNew) {
    return <SignUp />;
  }

  return (
    <div
      style={{
        flex: 1,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#393E41"
      }}
    >
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="h1" component="h2" style={{ color: "#fdc029" }}>
          Step It Up
        </Typography>
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px"
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-email-input"
          label="Email"
          type="email"
          autoComplete="email"
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          className={classes.textInput}
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={event => {
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
          marginTop: "30px"
        }}
      >
        <Button
          onClick={() => {
            onSignIn(email, password);
          }}
          className={classes.root}
        >
          Sign In
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "120px"
        }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          style={{ cursor: "pointer", color: "#E7E5DF" }}
          onClick={() => {
            onResetPassword(email, password);
          }}
        >
          Forgot Password?
        </Typography>
        <NavLink
          style={{
            textDecoration: "none",
            color: "#E7E5DF",
            marginLeft: "40px"
          }}
          to="/signUp"
        >
          <Typography
            variant="subtitle1"
            component="h2"
            style={{ cursor: "pointer" }}
          >
            Sign Up
          </Typography>
        </NavLink>
      </div>
    </div>
  );
}

export default SignIn;
