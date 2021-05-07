import React, { useState, useCallback, useEffect } from "react";
import { useAuthenticatedUserContext } from "../auth/AuthenticatedUserContext";
import "../App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { ListItem, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";
import "firebase/auth";
import EditActivities from "./EditActivities";
import SyncLoader from "react-spinners/SyncLoader";
import Landing from "./pages/Landing/Landing";
import UserProfile from "./pages/user/UserProfile";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import colors from "../assets/colors";
import NewChallenge from "./pages/NewChallenge/NewChallenge";
import About from "./pages/About/AboutPage";
import ChallengeDetails from "./pages/Challenge/ChallengeDetails";
import logo from "../assets/logo.png";
import { getUser } from "../api/userApi";
import { useUserContext } from "./pages/user/UserContext";

const drawerWidth = "100%";

const useStyles = makeStyles((theme) => ({
  header: {
    height: theme.spacing(10),
    width: "100%",
    zIndex: 2000,
    backgroundColor: colors.stepitup_blueishGray,
  },
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
    textDecoration: "none",
    color: colors.white,
    "&:hover": {
      textDecoration: "none",
      color: colors.stepitup_blue,
    },
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
  content: {
    padding: theme.spacing(3),
    height: "100%",
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

  const AuthRoutes = () => (
    <Route
      render={({ location }) => (
        <div key={location.pathname}>
          <Switch location={location}>
            <Route path="/home" exact component={Landing} />
            <Redirect to="/home" />
          </Switch>
        </div>
      )}
    />
  );

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  const classes = useStyles();

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: colors.almostWhite,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <SyncLoader color={colors.stepitup_blue} />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div style={{ backgroundColor: colors.almostWhite }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: "100%",
        width: "100%",
        minHeight: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      <BrowserRouter>
        <div id="header" className={classes.header}>
          <NavLink className={classes.logoHeading} to="/home">
            <img src={logo} alt="logo" height={40} width={40} />
            <Typography
              variant="h5"
              style={{ color: colors.almostBlack, marginLeft: "12px" }}
            >
              StepQuest
            </Typography>
          </NavLink>

          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
          >
            {open ? (
              <CancelIcon
                style={{
                  fontSize: 40,
                  color: colors.white,
                }}
              />
            ) : (
              <MenuIcon
                style={{
                  fontSize: 40,
                  color: colors.almostBlack,
                }}
              />
            )}
          </IconButton>
        </div>

        <div className={classes.content}>
          <Switch>
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

            <Redirect to={`/user/${userId}`} />
          </Switch>
        </div>

        <Drawer
          className={classes.drawer}
          anchor="right"
          classes={{
            paper: classes.drawerPaper,
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
