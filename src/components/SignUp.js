import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import { Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  textInput: {
    width: "20vw",
    "& label.Mui-focused": {
      color: "#E7E5DF"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#E7E5DF"
    }
  },
  root: {
    background: "#E3B5A4",
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 48,
    padding: "0 30px"
  },
  root: {
    background: "#E3B5A4",
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 48,
    padding: "0 30px"
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
        <Typography variant="h1" component="h2" style={{ color: "#E7E5DF" }}>
          StepTracker
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px"
        }}
      >
        <Typography variant="h3" component="h2" style={{ color: "#E7E5DF" }}>
          Sign Up
        </Typography>
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px"
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-username-input"
          label="Username"
          type="username"
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
        <NavLink
          style={{ textDecoration: "none", color: "#EFEFEF" }}
          to="/signIn"
        >
          <Typography
            variant="subtitle1"
            component="h2"
            style={{ cursor: "pointer" }}
          >
            Back to Sign In
          </Typography>
        </NavLink>
      </div>
    </div>
  );
}

export default SignUp;
