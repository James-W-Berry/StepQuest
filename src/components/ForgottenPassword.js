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
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  textInput: {
    width: "20vw",
    "& label ": {
      color: "#E7E5DF80"
    },
    "& label.Mui-focused": {
      color: "#fdc029"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#171820"
    }
  },
  root: {
    "&:hover": {
      color: "#fdc029"
    },
    border: 0,
    borderRadius: 3,
    color: "#E7E5DF",
    height: 48,
    padding: "0 30px"
  },
  input: {
    color: "white"
  }
});

function onResetPassword(email) {
  console.log("resettingpassword ");
  console.log(email);
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function() {
      alert("Check your email to reset your password.");
    })
    .catch(function(error) {
      console.log("error resetting password ");

      alert(
        "Could not send email, please enter your email address and try again."
      );
    });
}

function ForgottenPassword(props) {
  const [email, setEmail] = useState("");
  const classes = useStyles();

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
        <Typography
          variant="h1"
          component="h2"
          style={{ color: "#fdc029", marginTop: "20px" }}
        >
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
          InputProps={{
            className: classes.input
          }}
          autoComplete="email"
          onChange={event => {
            setEmail(event.target.value);
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
            onResetPassword(email);
          }}
          className={classes.root}
        >
          Reset Password
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
        <NavLink style={{ textDecoration: "none" }} to="/signIn">
          <Button className={classes.root} style={{ color: "#E7E5DF80" }}>
            Back to Sign In
          </Button>
        </NavLink>
      </div>
    </div>
  );
}

ForgottenPassword.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(ForgottenPassword);
