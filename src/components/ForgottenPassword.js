import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "typeface-roboto";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Divider } from "@material-ui/core";
import Img from "react-image";
import logo from "../assets/logo.png";

const Logo = () => <Img src={logo} height={50} width={50} />;

const useStyles = makeStyles({
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#ffffff",
    margin: 0,
    flexShrink: 0,
    width: "100%",
  },
  textInput: {
    width: "20vw",
    "& label ": {
      color: "#ffffff",
    },
    "& label.Mui-focused": {
      color: "#ffffff",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#ffffff",
    },
  },
  root: {
    "&:hover": {
      color: "#ffffff90",
    },
    border: 0,
    borderRadius: 3,
    color: "#ffffff",
    height: 48,
    padding: "0 30px",
  },
  input: {
    color: "#ffffff",
  },
  forgotButton: {
    "&:hover": {
      color: "#ffffff",
    },
    border: 0,
    borderRadius: 3,
    color: "#ffffff80",
    height: 48,
    padding: "0 30px",
  },
});

function onResetPassword(email) {
  console.log("resettingpassword ");
  console.log(email);
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      alert("Check your email to reset your password.");
    })
    .catch(function (error) {
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
          <NavLink
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              textDecoration: "none",
            }}
            to="/home"
          >
            <Logo />
            <Typography
              variant="h5"
              style={{ color: "#ffffff", marginLeft: "20px" }}
            >
              Step It Up
            </Typography>
          </NavLink>
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
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-email-input"
          label="Email"
          type="email"
          InputProps={{
            className: classes.input,
          }}
          autoComplete="email"
          onChange={(event) => {
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
          marginTop: "30px",
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
    </div>
  );
}

ForgottenPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ForgottenPassword);
