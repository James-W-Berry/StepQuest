import React, { useState, useCallback, useEffect } from "react";
import { useAuthenticatedUserContext } from "../auth/AuthenticatedUserContext";
import "../App.scss";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import {
  AppBar,
  ListItem,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Popover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";
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
import SignUp from "./pages/SignUp/SignUp";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import { ExpandMoreOutlined } from "@material-ui/icons";
import FAQ from "./pages/FAQ/FAQ";
import Resources from "./pages/Resources/Resources";

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
      cursor: "pointer",
    },
    padding: "10px",
  },
  navLinkButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
    padding: "10px",
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
      color: colors.white,
      backgroundColor: colors.almostBlack,
    },
    marginBottom: "0px",
  },
}));

export default function Main() {
  const theme = useTheme();
  const [email, setEmail] = useState();
  const [displayName, setDisplayName] = useState();
  const shouldCollapseIntoDrawer = useMediaQuery(theme.breakpoints.up("md"));
  const {
    authenticatedUser: { isLoading, loggedIn, userId },
    setAuthenticatedUser,
  } = useAuthenticatedUserContext();
  const { setUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  function onAuthStateChange(callback) {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
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
          response.data.displayName !== "Anonymous" &&
            setDisplayName(response.data.displayName);
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

  function logout() {
    firebase.auth().signOut();
  }

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
    <div style={{ height: "100%", backgroundColor: theme.background }}>
      <BrowserRouter>
        <ScrollToTop />
        <AppBar
          position="fixed"
          style={{
            backgroundColor: theme.palette.background.main,
          }}
        >
          <Toolbar>
            <NavLink to={`/`} className={classes.navLink}>
              <Typography className="header-title">STEPQUEST</Typography>
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
                <div className={classes.navLink}>
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    {...bindHover(popupState)}
                  >
                    <Typography className={classes.navLink}>
                      RESOURCES
                    </Typography>
                    <ExpandMoreOutlined style={{ width: "0.8em" }} />
                  </div>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    disableRestoreFocus
                  >
                    <Paper className="menu">
                      <NavLink
                        to={`/user/${userId}`}
                        className={classes.navLink}
                        style={{ padding: "0px" }}
                      >
                        <Typography>WORKOUT TIPS</Typography>
                      </NavLink>
                      <Typography>INSPIRATION</Typography>
                      <Typography>CHALLENGE TIPS</Typography>
                    </Paper>
                  </Popover>
                </div>
                <NavLink to={`/join-a-challenge`} className={classes.navLink}>
                  <Typography className={classes.navLink}>
                    JOIN A CHALLENGE
                  </Typography>
                </NavLink>
                <NavLink to={`/about`} className={classes.navLink}>
                  <Typography className={classes.navLink}>ABOUT</Typography>
                </NavLink>
                <NavLink to={`/faq`} className={classes.navLink}>
                  <Typography className={classes.navLink}>FAQ</Typography>
                </NavLink>
                {loggedIn ? (
                  <div className={classes.navLink}>
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      {...bindHover(popupState)}
                    >
                      <Typography className={classes.navLink}>
                        {displayName?.toUpperCase() || email?.toUpperCase()}
                      </Typography>
                      <ExpandMoreOutlined style={{ width: "0.8em" }} />
                    </div>
                    <Popover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      disableRestoreFocus
                    >
                      <Paper className="menu">
                        <NavLink
                          to={`/user/${userId}`}
                          className={classes.navLink}
                          style={{ padding: "0px" }}
                        >
                          <Typography>PROFILE</Typography>
                        </NavLink>
                        <Typography>MY CHALLENGES</Typography>
                        <Typography>SETTINGS</Typography>
                        <Typography onClick={requestLogout}>LOG OUT</Typography>
                      </Paper>
                    </Popover>
                  </div>
                ) : (
                  <NavLink to={`/signin`} className={classes.navLinkButton}>
                    <button className="header-menu-button">
                      <p className={classes.signInLink}>SIGN IN</p>
                    </button>
                  </NavLink>
                )}
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
                <div key="signin" style={{ height: "100%", width: "100%" }}>
                  <SignIn />
                </div>
              )}
            />
            <Route
              path="/signup"
              render={() => (
                <div key="signup" style={{ height: "100%", width: "100%" }}>
                  <SignUp />
                </div>
              )}
            />
            <Route
              path="/password-reset"
              render={() => (
                <div
                  key="password-reset"
                  style={{ height: "100%", width: "100%" }}
                >
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
              path="/faq"
              render={() => (
                <div key="faq" style={{ height: "100%", width: "100%" }}>
                  <FAQ />
                </div>
              )}
            />
            <Route
              path="/resources"
              render={() => (
                <div key="about" style={{ height: "100%", width: "100%" }}>
                  <Resources />
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
                <div key="create" style={{ height: "100%", width: "100%" }}>
                  <NewChallenge />
                </div>
              )}
            />
            <Route
              path="/join-a-challenge"
              render={() => (
                <div key="join" style={{ height: "100%", width: "100%" }}>
                  <NewChallenge />
                </div>
              )}
            />
            <Route
              path="/"
              exact
              render={() => (
                <div key="home" style={{ height: "100%", width: "100%" }}>
                  <Landing />
                </div>
              )}
            />

            <Redirect to="/" />
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
                <ListItem button>
                  <Typography style={{ fontSize: "2rem" }}>Profile</Typography>
                </ListItem>
              </NavLink>
              <NavLink className={classes.navLink} to="/create-challenge">
                <ListItem button>
                  <Typography style={{ fontSize: "2rem" }}>
                    Create a new challenge
                  </Typography>
                </ListItem>
              </NavLink>
              <NavLink className={classes.navLink} to="/about">
                <ListItem button>
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
              <Typography
                style={{ marginRight: "10px", color: colors.stepQuestGray }}
              >
                Logout
              </Typography>
              <LogoutIcon style={{ color: colors.stepQuestGray }} />
            </div>
          </div>
        </Drawer>
      </BrowserRouter>
    </div>
  );
}
