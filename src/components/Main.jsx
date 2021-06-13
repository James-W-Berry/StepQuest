import React, { useState, useCallback, useEffect } from "react";
import { useAuthenticatedUserContext } from "../auth/AuthenticatedUserContext";
import "../App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import {
  AppBar,
  Button,
  ListItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import { NavLink } from "react-router-dom";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";
import "firebase/auth";
import EditActivities from "./EditActivities";
import Landing from "./pages/Landing/Landing";
import UserProfile from "./pages/User/UserProfile";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import colors from "../assets/colors";
import NewChallenge from "./pages/NewChallenge/NewChallenge";
import About from "./pages/About/AboutPage";
import ChallengeDetails from "./pages/Challenge/ChallengeDetails";
import { getUser } from "../api/userApi";
import { useUserContext } from "./pages/User/UserContext";
import ScrollToTop from "./ScrollToTop";
import Loading from "./Loading";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import PasswordReset from "./pages/PasswordReset/PasswordReset";

const drawerWidth = "100%";

const useStyles = makeStyles((theme) => ({
  logoHeading: {
    position: "absolute",
    padding: "12px",
    margin: "12px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "none",
    },
  },
  menuButton: {
    position: "absolute",
    margin: "12px",
    zIndex: 2000,
    right: "0px",
  },
  list: {
    marginTop: "20%",
  },
  navLink: {
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
    padding: "10px",
  },
  navLinkButton: {
    width: "95%",
    marginLeft: "5%",
  },
  drawerPaper: {
    background: colors.almostBlack,
    width: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  signInButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: colors.almostBlack,
    },
  },
  signInLink: {
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      color: colors.almostWhite,
    },
    padding: "10px",
  },
}));

function logout() {
  firebase.auth().signOut();
}

function onAuthStateChange(callback) {
  return firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      callback({
        loggedIn: true,
        email: user.email,
        isLoading: false,
        userId: user.uid,
      });
    } else {
      callback({ loggedIn: false, isLoading: false });
    }
  });
}

export default function Main() {
  const theme = useTheme();
  const shouldCollapseIntoDrawer = useMediaQuery(theme.breakpoints.up("md"));

  const {
    authenticatedUser: { isLoading, loggedIn, userId },
    setAuthenticatedUser,
  } = useAuthenticatedUserContext();
  const { setUser } = useUserContext();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setAuthenticatedUser);
    return () => {
      unsubscribe();
    };
  }, [setAuthenticatedUser]);

  useEffect(() => {
    if (userId) {
      getUser(userId).then((response) => {
        if (response.success) {
          setUser(response.data);
        }
      });
    }
  }, [userId, setUser]);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(!open);
  };

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  const classes = useStyles();

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: theme.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div className="background" style={{ backgroundColor: theme.background }}>
      <BrowserRouter>
        <ScrollToTop />
        <AppBar
          position="fixed"
          style={{
            backgroundColor: theme.palette.background.main,
          }}
        >
          <Toolbar>
            <NavLink to={`/home`} className={classes.navLink}>
              <Typography
                style={{
                  color: theme.palette.primary.main,
                  fontFamily: "Josefin Sans",
                  fontWeight: 100,
                  fontSize: "1.2rem",
                  letterSpacing: "0.4rem",
                }}
              >
                STEPQUEST
              </Typography>
            </NavLink>

            {shouldCollapseIntoDrawer ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <NavLink to={`/join-a-challenge`} className={classes.navLink}>
                  <Typography className={classes.navLink}>
                    JOIN A CHALLENGE
                  </Typography>
                </NavLink>
                <NavLink to={`/about`} className={classes.navLink}>
                  <Typography className={classes.navLink}>ABOUT</Typography>
                </NavLink>
                <NavLink to={`/signin`} className={classes.navLink}>
                  <Button className={classes.signInButton}>
                    <Typography className={classes.signInLink}>
                      SIGN IN
                    </Typography>
                  </Button>
                </NavLink>
              </div>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={toggleDrawer(true)}
                className={classes.menuButton}
              >
                {open ? (
                  <CancelIcon
                    style={{
                      fontSize: 40,
                      color: theme.palette.primary.main,
                    }}
                  />
                ) : (
                  <MenuIcon
                    style={{
                      fontSize: 40,
                      color: theme.palette.primary.main,
                    }}
                  />
                )}
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <div className="content">
          <Switch>
            <Route
              path="/signin"
              render={() => (
                <div key="about" style={{ height: "100%", width: "100%" }}>
                  <SignIn />
                </div>
              )}
            />
            <Route
              path="/signup"
              render={() => (
                <div key="about" style={{ height: "100%", width: "100%" }}>
                  <SignUp />
                </div>
              )}
            />
            <Route
              path="/password-reset"
              render={() => (
                <div key="about" style={{ height: "100%", width: "100%" }}>
                  <PasswordReset />
                </div>
              )}
            />
            <Route
              path="/user/:id"
              render={(props) => (
                <div key="profile" style={{ height: "100%", width: "100%" }}>
                  <UserProfile {...props} />
                </div>
              )}
            />
            <Route
              path="/challenge/:id"
              render={(props) => (
                <div key="challenge" style={{ height: "100%", width: "100%" }}>
                  <ChallengeDetails {...props} />
                </div>
              )}
            />
            <Route
              path="/about"
              render={() => (
                <div key="about" style={{ height: "100%", width: "100%" }}>
                  <About />
                </div>
              )}
            />
            <Route
              path="/edit"
              render={() => (
                <div key="edit" style={{ height: "100%", width: "100%" }}>
                  <EditActivities userId={userId} />
                </div>
              )}
            />
            <Route
              path="/create-challenge"
              render={() => (
                <div key="edit" style={{ height: "100%", width: "100%" }}>
                  <NewChallenge />
                </div>
              )}
            />
            <Route
              path="/home"
              render={() => (
                <div key="edit" style={{ height: "100%", width: "100%" }}>
                  <Landing />
                </div>
              )}
            />

            <Redirect to="/home" />
          </Switch>
        </div>

        <Drawer
          className={classes.drawer}
          anchor="right"
          classes={{
            paper: theme.palette.background.default,
          }}
          open={open}
          onClose={toggleDrawer()}
        >
          <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer()}
            onKeyDown={toggleDrawer()}
          >
            <List component="nav">
              <NavLink className={classes.navLink} to={`/user/${userId}`}>
                <ListItem button className={classes.navLinkButton}>
                  <Typography style={{ fontSize: "2rem" }}>Profile</Typography>
                </ListItem>
              </NavLink>
              <NavLink className={classes.navLink} to="/create-challenge">
                <ListItem button className={classes.navLinkButton}>
                  <Typography style={{ fontSize: "2rem" }}>
                    Create a new challenge
                  </Typography>
                </ListItem>
              </NavLink>
              <NavLink className={classes.navLink} to="/about">
                <ListItem button className={classes.navLinkButton}>
                  <Typography style={{ fontSize: "2rem" }}>About</Typography>
                </ListItem>
              </NavLink>
            </List>
            <div
              onClick={requestLogout}
              style={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                bottom: "40px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <Typography style={{ marginRight: "10px", color: colors.white }}>
                Logout
              </Typography>
              <LogoutIcon style={{ color: colors.white }} />
            </div>
          </div>
        </Drawer>
      </BrowserRouter>
    </div>
  );
}
