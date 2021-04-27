import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { ListItem, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "./firebase";
import "firebase/auth";
import EditActivities from "./components/EditActivities";
import SyncLoader from "react-spinners/SyncLoader";
import Landing from "./components/Landing";
import UserProfile from "./components/pages/user/UserProfile";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import colors from "./assets/colors";
import NewChallenge from "./components/pages/NewChallenge/NewChallenge";
import About from "./components/pages/About/AboutPage";
import ChallengeDetails from "./components/pages/Challenge/ChallengeDetails";

const drawerWidth = "100%";

const useStyles = makeStyles((theme) => ({
  logoHeading: {
    position: "absolute",
    left: "16px",
    top: "16px",
  },
  menuButton: {
    position: "absolute",
    right: "16px",
    top: "16px",
    zIndex: 2000,
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
  fullList: {
    width: "auto",
  },
  drawerPaper: {
    background: colors.almostBlack,
    width: drawerWidth,
  },
  paperAnchorDockedLeft: {
    borderRight: "1px",
    borderLeft: "0px",
    borderTop: "0px",
    borderBottom: "0px",
    borderRightColor: "#ffffff",
    borderStyle: "solid",
  },
  divider: {
    backgroundColor: "#ffffff",
    width: "90%",
    display: "flex",
    alignSelf: "center",
  },
  root: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    height: "100%",
    padding: theme.spacing(3),
    marginTop: theme.spacing(8),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged((user) => {
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

function logout() {
  firebase.auth().signOut();
}

function App() {
  const [user, setUser] = useState({
    loggedIn: false,
    isLoading: true,
    userId: "",
  });
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(!open);
  };

  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

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

  if (user.isLoading) {
    return (
      <div
        style={{
          backgroundColor: colors.white,
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

  if (!user.loggedIn) {
    return (
      <div style={{ backgroundColor: colors.almostWhite }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }

  return (
    <UserProvider value={user}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BrowserRouter>
          <NavLink
            style={{ textDecoration: "none", color: colors.almostBlack }}
            to="/home"
          >
            <Typography
              variant="h4"
              className={classes.logoHeading}
              color="inherit"
              aria-label="home"
              edge="start"
            >
              Step It Up
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

          <div className={classes.content}>
            <Switch>
              <Route
                path="/user/:id"
                render={(props) => (
                  <div key="profile" style={{ height: "100%", width: "100%" }}>
                    <UserProfile userId={user.userId} {...props} />
                  </div>
                )}
              />
              <Route
                path="/challenge/:id"
                render={(props) => (
                  <div key="profile" style={{ height: "100%", width: "100%" }}>
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
                    <EditActivities userId={user.userId} />
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

              <Redirect to={`/user/${user.userId}`} />
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
                <NavLink
                  className={classes.navLink}
                  to={`/user/${user.userId}`}
                >
                  <ListItem button className={classes.navLinkButton}>
                    <Typography style={{ fontSize: "2rem" }}>
                      Profile
                    </Typography>{" "}
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
                <Typography
                  style={{ marginRight: "10px", color: colors.white }}
                >
                  Logout
                </Typography>
                <LogoutIcon style={{ color: colors.white }} />
              </div>
            </div>
          </Drawer>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
