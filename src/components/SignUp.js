import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import { Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
function onSignUp(username, email, password) {
  const db = firebase.firestore();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      var userId = firebase.auth().currentUser.uid;

      db.collection("users")
        .doc(userId)
        .set({
          displayName: username,
          totalSteps: 0
        })
        .catch(function(error) {
          console.log(error);
        });

      console.log("sign up successful");
    })
    .catch(function(error) {
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          id="standard-username-input"
          label="Display Name"
          type="username"
          InputProps={{
            className: classes.input
          }}
          onChange={event => {
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
            className: classes.input
          }}
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
          InputProps={{
            className: classes.input
          }}
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
            onSignUp(username, email, password);
          }}
          className={classes.root}
        >
          Sign Up
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

SignUp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(SignUp);
