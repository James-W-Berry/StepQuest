import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";

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
          displayName: username
        })
        .catch(function(error) {
          console.log(error);
        });

      console.log("sign up successful");
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`${errorCode}: ${errorMessage}`);
    });
}

function SignUp() {
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <h1>Sign Up</h1>
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
            setUsername(event.target.value);
          }}
        />
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
            onSignUp(username, email, password);
          }}
        >
          SignUp
        </button>
        <NavLink
          style={{ textDecoration: "none", color: "#EFEFEF" }}
          to="/signIn"
        >
          <button>Back to Sign In</button>
        </NavLink>
      </div>
    </div>
  );
}

export default SignUp;
