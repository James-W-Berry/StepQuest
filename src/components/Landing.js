import React, { useState } from "react";
import "../App.css";
import "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography, IconButton, Dialog, TextField } from "@material-ui/core";
import LandingCarousel from "./LandingCarousel";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from "@material-ui/core/styles";
import firebase from "../firebase";
import "firebase/auth";
import "typeface-roboto";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import colors from "../assets/colors";
import SyncLoader from "react-spinners/SyncLoader";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.white,
  },
});

const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover": {
      backgroundColor: colors.almostWhite,
    },
    border: 0,
    borderRadius: 3,
    backgroundColor: colors.white,
    color: colors.stepitup_blue,
    height: 48,
    padding: "0 30px",
  },
  title: {
    fontFamily: "Monoton",
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
  textInput: {
    "& label ": {
      color: colors.stepitup_blue,
    },
    "& label.Mui-focused": {
      color: colors.stepitup_blue,
    },
    "& .MuiInput-underline:after": {
      color: colors.stepitup_blue,
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
      width: "80%",
    },
  },
  input: {
    color: colors.almostBlack,
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ color: colors.white }} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: colors.white,
  },
}))(MuiDialogContent);

function Landing(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [loginVisible, setLogInVisible] = useState(false);
  const [signupVisible, setSignUpVisible] = useState(false);
  const [forgottenPasswordVisible, setForgottenPasswordVisible] = useState(
    false
  );
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSignIn(email, password) {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((doc) => {
        console.log("Sign in successful");
        ensureUserExists(doc.user.uid);
      })
      .catch(function (error) {
        alert("Incorrect email or password, please try again");
        setIsLoading(false);
      });
  }

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

  function onResetPassword(email) {
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

  function ensureUserExists(id) {
    setIsLoading(true);
    const userDoc = firebase.firestore().collection("users").doc(id);

    userDoc.get().then((doc) => {
      if (doc.data().totalDuration) {
        console.log("user already initialized");
      } else {
        userDoc.set({ totalDuration: 0 }).catch(function (error) {
          console.log(error);
        });

        setIsLoading(false);
      }
    });
  }

  return (
    <div>
      <div class="bg">
        <div class="overlay">
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
              <Typography className={classes.title}>Step It Up</Typography>

              <Typography className={classes.subtitle}>
                Fitness challenges for groups
              </Typography>
            </div>

            <div class="content">
              <LandingCarousel />
            </div>

            <div
              class="authbuttons"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <div>
                <Button
                  className={classes.button}
                  style={{ width: "100%" }}
                  onClick={() => setLogInVisible(true)}
                >
                  <Typography>Log In</Typography>
                </Button>
              </div>

              <div>
                <Button
                  className={classes.button}
                  style={{ width: "100%" }}
                  onClick={() => setSignUpVisible(true)}
                >
                  <Typography>Sign Up</Typography>
                </Button>
              </div>
            </div>

            <Dialog
              fullScreen={fullScreen}
              fullWidth={true}
              onClose={() => setLogInVisible(false)}
              aria-labelledby="customized-dialog-title"
              open={loginVisible}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.stepitup_blue,
                }}
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={() => setLogInVisible(false)}
                >
                  Login
                </DialogTitle>
              </div>

              <DialogContent className="dialog" style={{ padding: "0px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    background: "#ffffffcc",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: "1",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                      width: "80%",
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
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "30px",
                      marginRight: "20px",
                    }}
                  >
                    {isLoading ? (
                      <SyncLoader color={colors.stepitup_blue} />
                    ) : (
                      <Button
                        onClick={() => {
                          onSignIn(email, password);
                        }}
                        className={classes.button}
                        style={{
                          backgroundColor: colors.stepitup_blue,
                          color: colors.white,
                        }}
                      >
                        Log In
                      </Button>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flex: "1",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "120px",
                      padding: "20px",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setLogInVisible(false);
                        setForgottenPasswordVisible(true);
                      }}
                      className={classes.button}
                      style={{
                        backgroundColor: colors.stepitup_blue,
                        color: colors.white,
                      }}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              fullScreen={fullScreen}
              fullWidth={true}
              onClose={() => setSignUpVisible(false)}
              aria-labelledby="customized-dialog-title"
              open={signupVisible}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.stepitup_blue,
                }}
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={() => setSignUpVisible(false)}
                >
                  Sign up
                </DialogTitle>
              </div>

              <DialogContent className="dialog" style={{ padding: "0px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    background: "#ffffffcc",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: "1",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                      width: "80%",
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
                      padding: "20px",
                    }}
                  >
                    {isLoading ? (
                      <SyncLoader color={colors.stepitup_blue} />
                    ) : (
                      <Button
                        onClick={() => {
                          onSignUp(username, email, password);
                        }}
                        className={classes.button}
                        style={{
                          backgroundColor: colors.stepitup_blue,
                          color: colors.white,
                        }}
                      >
                        Sign Up
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              fullScreen={fullScreen}
              fullWidth={true}
              onClose={() => setForgottenPasswordVisible(false)}
              aria-labelledby="customized-dialog-title"
              open={forgottenPasswordVisible}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.stepitup_blue,
                }}
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={() => setForgottenPasswordVisible(false)}
                >
                  Forgot Password
                </DialogTitle>
              </div>

              <DialogContent className="dialog" style={{ padding: "0px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    background: "#ffffffcc",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: "1",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                      width: "80%",
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
                      padding: "20px",
                    }}
                  >
                    <Button
                      onClick={() => {
                        onResetPassword(email);
                      }}
                      className={classes.root}
                      style={{
                        backgroundColor: colors.stepitup_blue,
                        color: colors.white,
                      }}
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Landing);
