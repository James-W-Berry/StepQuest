import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import SignUp from "./SignUp";
import { NavLink } from "react-router-dom";

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

  if (user.isNew) {
    return <SignUp />;
  }

  return (
    <div
      style={{
        flex: 1,
        width: "100vw",
        height: "100vh",

        backgroundColor: "#2C239A"
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
        <h1>Sign In</h1>
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
        <input
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          onChange={event => {
            setPassword(event.target.value);
          }}
        />
        <button
          onClick={() => {
            onSignIn(email, password);
          }}
        >
          Login
        </button>
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
        <button
          onClick={() => {
            onResetPassword(email, password);
          }}
        >
          Forgot Password?
        </button>
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
        <NavLink
          style={{ textDecoration: "none", color: "#EFEFEF" }}
          to="/signUp"
        >
          <button>Sign Up</button>
        </NavLink>
      </div>
    </div>
  );
}

export default SignIn;
